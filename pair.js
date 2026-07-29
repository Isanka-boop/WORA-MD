/*                                                                                                                                    
  AKIRA GIRL MD MINI BOT - MULTI SESSION SUPPORT
  DEVELOPED BY CHAMOD TECH OFC
  FULLY ENC AND PRIVET SOURCE CODE    
  Code Ussai #akak - Thawa #akada balanne                                                                    
*/

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const {
    exec
} = require('child_process');
const { sms } = require("./msg");
const router = express.Router();
const pino = require('pino');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Jimp = require('jimp');
const crypto = require('crypto');
const axios = require('axios');
const yts = require('yt-search');
const { ytmp3, ytmp4 } = require('sadaslk-dlcore');
const os = require('os');
const fecth = require('node-fetch');
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);
const commands = require('./commands');
const { handleAutoVoiceReply } = require('./autoVoiceListener');
  const images = [
    'https://files.catbox.moe/2xav1z.jpg'
  ]; 

const akira = images[Math.floor(Math.random() * images.length)];

const {
    default: makeWASocket,
    makeCacheableSignalKeyStore,
    useMultiFileAuthState,
    DisconnectReason,
    downloadMediaMessage,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    fetchLatestBaileysVersion, 
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    extractMessageContent, 
    jidDecode,
    MessageRetryMap,
    jidNormalizedUser, 
    proto,
    getContentType,
    areJidsSameUser,
    generateWAMessage, 
    delay, 
    Browsers
} = require("baileys");

const config = {
    AUTO_VIEW_STATUS: 'true',
    AUTO_LIKE_STATUS: 'true',
    MODE: 'public',
    PREFIX: '.',
    MAX_RETRIES: 3,
    ADMIN_LIST_PATH: './admin.json',
    AKIRA_IMG: 'https://i.ibb.co/FZjptLY/tourl-1779693358137.jpg',
    NEWSLETTER_JID: '120363399723529947@newsletter',
    NEWSLETTER_LIST: [
        '120363399723529947@newsletter'
    ],
    NEWSLETTER_MESSAGE_ID: '428',
    OTP_EXPIRY: 180,
    OWNER_NUMBER: '94761480834',
    CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbAp1d6HVvTSFTYtco0T'
};

const replyFq = (text) => reply(text);
const activeSockets = new Map();
const socketCreationTime = new Map();
const socketHandlersMap = new Map();
// Tracks numbers that currently have a pairing attempt in flight (code
// requested but not yet confirmed open/closed). WhatsApp flags/restricts
// accounts that get two overlapping link attempts for the same number —
// e.g. the user hits "pair" twice, or retries before the first pairing
// code has actually been used/expired. Blocking a second attempt while
// one is still pending prevents that.
const pairingLocks = new Map(); // sanitizedNumber -> timestamp lock was set
const PAIRING_LOCK_TIMEOUT_MS = 90 * 1000; // safety net so a hung attempt can't lock a number forever
const pairingCooldownUntil = new Map(); // sanitizedNumber -> timestamp before which retries are refused
const PAIRING_COOLDOWN_MS = 15 * 1000; // short gap between attempts, even after one ends, to avoid rapid-fire link requests
const reconnectAttempts = new Map(); // sanitizedNumber -> consecutive temporary-disconnect count, reset on successful open
const welcomeSentNumbers = new Set(); // in-memory guard: prevents duplicate welcome sends across reconnects in this process
const SESSION_BASE_PATH = './session';
const NUMBER_LIST_PATH = './numbers.json';
// Protects the manual /backup/:number and /restore/:number endpoints below.
// Without a key, /restore could let anyone who knows a phone number take
// over that number's active WhatsApp session with no pairing-code step —
// so these routes stay disabled until ADMIN_KEY is actually set.
const ADMIN_KEY = process.env.ADMIN_KEY || 'Isanka#000';
function requireAdmin(req, res) {
    if (!ADMIN_KEY) {
        res.status(503).send({ error: 'Admin endpoints disabled — set the ADMIN_KEY environment variable to enable /backup and /restore.' });
        return false;
    }
    if (req.query.key !== ADMIN_KEY) {
        res.status(403).send({ error: 'Invalid or missing admin key (pass ?key=...)' });
        return false;
    }
    return true;
}

// WhatsApp presence pings ("available"/"unavailable") only last about
// 10 seconds before reverting, so a one-off call at connect time isn't
// enough to keep a bot pinned to "always online" or "always offline".
// This loop re-sends the chosen presence for every connected number
// every few seconds, based on that number's own `presenceMode` setting
// (set via the alwaysonline / alwaysoffline commands). Numbers with no
// preference set (presenceMode is 'auto' or unset) are left alone —
// their presence just follows normal bot activity.
setInterval(() => {
    for (const [num, entry] of activeSockets) {
        const mode = entry?.config?.presenceMode;
        if (mode !== 'online' && mode !== 'offline') continue; // 'auto'/unset -> don't touch

        const socket = entry.socket;
        if (!socket || typeof socket.sendPresenceUpdate !== 'function') continue;

        const presence = mode === 'online' ? 'available' : 'unavailable';
        socket.sendPresenceUpdate(presence).catch(() => {});
    }
}, 8000);

// PERF: numbers.json used to be read + parsed + (maybe) rewritten
// synchronously on every single creds.update event, for every active
// session. Cache it in memory instead and only touch the file when the
// list actually changes.
let numbersCache = null;
async function getNumbersList() {
    if (numbersCache) return numbersCache;
    try {
        if (await fs.pathExists(NUMBER_LIST_PATH)) {
            numbersCache = JSON.parse(await fs.readFile(NUMBER_LIST_PATH, 'utf8'));
        } else {
            numbersCache = [];
        }
    } catch {
        numbersCache = [];
    }
    return numbersCache;
}
async function addNumberIfMissing(sanitizedNumber) {
    const numbers = await getNumbersList();
    if (!numbers.includes(sanitizedNumber)) {
        numbers.push(sanitizedNumber);
        await fs.writeFile(NUMBER_LIST_PATH, JSON.stringify(numbers, null, 2));
    }
}
async function removeNumber(sanitizedNumber) {
    const numbers = await getNumbersList();
    const idx = numbers.indexOf(sanitizedNumber);
    if (idx !== -1) {
        numbers.splice(idx, 1);
        await fs.writeFile(NUMBER_LIST_PATH, JSON.stringify(numbers, null, 2));
    }
}

// PERF: socket.groupMetadata() is a live round-trip to WhatsApp's servers.
// The old code awaited it on every single command sent inside a group, even
// commands that never look at group/admin info. Cache it briefly per group
// so a burst of commands in the same group doesn't refetch every time.
const groupMetadataCache = new Map(); // jid -> { data, ts }
const GROUP_META_TTL_MS = 60 * 1000;
async function getGroupMetadataCached(socket, jid) {
    const cached = groupMetadataCache.get(jid);
    if (cached && (Date.now() - cached.ts) < GROUP_META_TTL_MS) return cached.data;
    const data = await socket.groupMetadata(jid);
    groupMetadataCache.set(jid, { data, ts: Date.now() });
    return data;
}

const SessionSchema = new mongoose.Schema({
    number: {
        type: String,
        unique: true,
        required: true
    },
    creds: {
        type: Object,
        required: true
    },
    config: {
        type: Object
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
const Session = mongoose.model('Session', SessionSchema);

// Keeps a short rolling history of previous creds per number. Every time a
// session is saved or deleted, the *previous* state is snapshotted here
// first. This means a bad write, an accidental delete, or a bug like the
// 408-misclassification one (see setupAutoRestart) can no longer destroy a
// user's session permanently — there's always a recent good copy to fall
// back to.
const SessionBackupSchema = new mongoose.Schema({
    number: { type: String, required: true, index: true },
    creds: { type: Object, required: true },
    config: { type: Object },
    reason: { type: String, default: 'update' }, // 'update' | 'delete'
    backedUpAt: { type: Date, default: Date.now }
});
const SessionBackup = mongoose.model('SessionBackup', SessionBackupSchema);
const MAX_BACKUPS_PER_NUMBER = 5;

async function backupSession(number, reason = 'update') {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const existing = await Session.findOne({ number: sanitizedNumber }).lean();
        if (!existing || !existing.creds || !existing.creds.me || !existing.creds.me.id) {
            return; // nothing valid to back up yet
        }

        await SessionBackup.create({
            number: sanitizedNumber,
            creds: existing.creds,
            config: existing.config,
            reason,
            backedUpAt: new Date()
        });

        // Prune to the most recent MAX_BACKUPS_PER_NUMBER entries for this number
        const old = await SessionBackup.find({ number: sanitizedNumber })
            .sort({ backedUpAt: -1 })
            .skip(MAX_BACKUPS_PER_NUMBER)
            .select('_id')
            .lean();
        if (old.length) {
            await SessionBackup.deleteMany({ _id: { $in: old.map(o => o._id) } });
        }
    } catch (error) {
        console.error(`[backupSession] Failed for ${number}:`, error.message);
    }
}

async function restoreFromBackup(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const latest = await SessionBackup.findOne({ number: sanitizedNumber })
            .sort({ backedUpAt: -1 })
            .lean();
        if (!latest || !latest.creds || !latest.creds.me || !latest.creds.me.id) {
            return null;
        }

        await Session.findOneAndUpdate(
            { number: sanitizedNumber },
            { creds: latest.creds, config: latest.config, updatedAt: new Date() },
            { upsert: true }
        );

        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
        await fs.ensureDir(sessionPath);
        await fs.writeFile(path.join(sessionPath, 'creds.json'), JSON.stringify(latest.creds, null, 2));

        console.log(`[restoreFromBackup] ✅ Restored ${sanitizedNumber} from backup dated ${latest.backedUpAt}`);
        return latest.creds;
    } catch (error) {
        console.error(`[restoreFromBackup] Failed for ${number}:`, error.message);
        return null;
    }
}

async function connectMongoDB() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://maliquotes6_db_user:3IvqoGEzt07fEZ0y@cluster0.bbsrc3v.mongodb.net/?appName=Cluster0';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
}
connectMongoDB();

if (!fs.existsSync(SESSION_BASE_PATH)) {
    fs.mkdirSync(SESSION_BASE_PATH, {
        recursive: true
    });
}

function initialize() {
    activeSockets.clear();
    socketCreationTime.clear();
    console.log('Cleared active sockets and creation times on startup');
}

async function uploadToCatbox(stream, fileName) {
    try {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', stream, fileName);

        const res = await axios.post(
            'https://catbox.moe/user/api.php',
            form,
            { headers: form.getHeaders(), timeout: 0 }
        );

        if (!res.data.startsWith('https://')) return null;
        return res.data.trim();
    } catch {
        return null;
    }
}

async function saveMediaToCatbox(msg) {
    try {
        const type = Object.keys(msg.message)[0];
        const mediaMap = {
            imageMessage: 'image',
            videoMessage: 'video',
            audioMessage: 'audio',
            documentMessage: 'document'
        };

        if (!mediaMap[type]) return null;

        const mediaMsg = msg.message[type];
        const size = mediaMsg.fileLength || 0;
        
        if (size > 100 * 1024 * 1024) return null;

        const stream = await downloadContentFromMessage(
            mediaMsg,
            mediaMap[type]
        );

        const ext =
            type === 'imageMessage' ? 'jpg' :
            type === 'videoMessage' ? 'mp4' :
            type === 'audioMessage' ? 'opus' :
            'bin';

        return await uploadToCatbox(stream, `${msg.key.id}.${ext}`);
    } catch {
        return null;
    }
}


async function cleanupInactiveSessions() {
    try {
        const sessions = await Session.find({}, 'number').lean();
        let cleanedCount = 0;

        for (const {
                number
            }
            of sessions) {
            const sanitizedNumber = number.replace(/[^0-9]/g, '');

            if (!activeSockets.has(sanitizedNumber) && !socketCreationTime.has(sanitizedNumber)) {
                const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

                if (fs.existsSync(sessionPath)) {
                    const stats = fs.statSync(sessionPath);
                    const timeSinceModified = Date.now() - stats.mtime.getTime();

                    if (timeSinceModified > 60 * 60 * 1000) {
                        console.log(`Cleaning up stale session: ${sanitizedNumber}`);
                        fs.removeSync(sessionPath);
                        cleanedCount++;
                    }
                }
            }
        }

        console.log(`Cleaned up ${cleanedCount} stale sessions`);
        return cleanedCount;
    } catch (error) {
        console.error('Cleanup error:', error);
        return 0;
    }
}

function setupNewsletterHandlers(socket) {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message?.key) return;

        const jid = message.key.remoteJid;

        if (jid !== config.NEWSLETTER_JID) return;

        try {
            const emojis = ['🎀', '🍬', '👽', '🌺', '🍓', '🍫', '🫐', '🥷'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            const messageId = message.key.server_id || message.newsletterServerId;

            if (!messageId) {
                console.warn('⚠️ No newsletterServerId found in message:', message);
                return;
            }

            await socket.newsletterReactMessage(jid, messageId.toString(), randomEmoji);
            console.log(`✅ Reacted to official newsletter: ${jid}`);
        } catch (error) {
            console.error('⚠️ Newsletter reaction failed:', error.message);
        }
    });
}


async function autoReconnectOnStartup() {
    try {
        let numbers = [];
        if (fs.existsSync(NUMBER_LIST_PATH)) {
            numbers = JSON.parse(fs.readFileSync(NUMBER_LIST_PATH, 'utf8'));
            console.log(`Loaded ${numbers.length} numbers from numbers.json`);
        }

        // FIX 4: invalid/incomplete sessions startup reconnect එකේදී skip කරනවා
        const sessions = await Session.find({}, 'number creds').lean();
        const mongoNumbers = sessions
            .filter(s => s.creds && s.creds.me && s.creds.me.id)
            .map(s => s.number);
        numbers = [...new Set([...numbers, ...mongoNumbers])];

        if (numbers.length === 0) {
            console.log('No valid numbers found for auto-reconnect');
            return;
        }

        console.log(`Attempting to reconnect ${numbers.length} sessions...`);

        for (const number of numbers) {
            const sanitized = number.replace(/[^0-9]/g, '');
            if (activeSockets.has(sanitized)) {
                console.log(`Number ${sanitized} already connected, skipping`);
                continue;
            }

            const mockRes = { headersSent: false, send: () => {}, status: () => mockRes };

            try {
                await EmpirePair(sanitized, mockRes);
                console.log(`✅ Initiated reconnect for ${sanitized}`);
            } catch (error) {
                console.error(`❌ Failed to reconnect ${sanitized}:`, error);
            }

            // FIX 4: delay වැඩි කළා — too-fast reconnects WhatsApp spam detection trigger කරනවා
            await delay(3000);
        }
    } catch (error) {
        console.error('Auto-reconnect on startup failed:', error);
    }
}

(async () => {
    await initialize();
    setTimeout(autoReconnectOnStartup, 5000); 
})();


function loadAdmins() {
    try {
        if (fs.existsSync(config.ADMIN_LIST_PATH)) {
            return JSON.parse(fs.readFileSync(config.ADMIN_LIST_PATH, 'utf8'));
        }
        return [];
    } catch (error) {
        console.error('Failed to load admin list:', error);
        return [];
    }
}

function formatMessage(title, content, footer) {
    return `*${title}*\n\n${content}\n\n> *${footer}*`;
}

function getSriLankaTimestamp() {
    return moment().tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');
}

const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

const runtime = (seconds) => {
	seconds = Number(seconds)
	var d = Math.floor(seconds / (3600 * 24))
	var h = Math.floor(seconds % (3600 * 24) / 3600)
	var m = Math.floor(seconds % 3600 / 60)
	var s = Math.floor(seconds % 60)
	var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
	var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
	var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
	var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

// PERF: setupMessageHandlers used to register a second messages.upsert
// listener here that computed a bunch of values (sender number, bot
// number, sanitized number, session config lookup) and then did nothing
// with them — pure overhead on every single incoming message, on top of
// the real handler in setupCommandHandlers. Removed; setupCommandHandlers
// already covers everything this needs.
async function setupMessageHandlers(socket) {}

function setupAutoRestart(socket, number) {
    const id = number;
    let reconnecting = false;

    socket.ev.on('connection.update', async ({ connection, lastDisconnect }) => {

        if (connection === 'open') {
            reconnecting = false;
            reconnectAttempts.delete(id); // fresh streak — connection is healthy again
            return;
        }

        if (connection !== 'close' || reconnecting) return;
        reconnecting = true;

        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const errorMessage = lastDisconnect?.error?.message || '';
        console.warn(`[${id}] Connection closed | code: ${statusCode} | msg: ${errorMessage}`);

        // FIX 2: permanent disconnect codes — reconnect loop නොකරන්න
        // 401 = logged out, 403 = banned/restricted, 440 = replaced (session taken over elsewhere)
        //
        // IMPORTANT: 408 (connectionLost / timedOut in Baileys) is NOT permanent —
        // it's a plain network timeout/blip. It used to be listed here by mistake,
        // which meant a normal Wi-Fi/network hiccup was treated the same as an
        // actual logout: the session got deleted and the user was silently forced
        // to re-pair from scratch. Besides logging users out for no real reason,
        // every one of those forced re-pairs is a fresh WhatsApp device-link
        // attempt — doing that repeatedly across many users is exactly what gets
        // accounts flagged/restricted. 408 now falls through to the normal
        // temporary-disconnect path below instead.
        const PERMANENT_CODES = [401, 403, 440];
        if (PERMANENT_CODES.includes(statusCode)) {
            console.warn(`[${id}] ⚠️ Permanent disconnect (code ${statusCode}) — deleting session, will NOT reconnect`);
            await destroySocket(id);
            await deleteSession(id);
            reconnectAttempts.delete(id);
            reconnecting = false;
            return;
        }

        // Temporary disconnect — reconnect, but back off the more it keeps
        // happening in a row instead of hammering WhatsApp with reconnects
        // every 3s. A flat fast retry loop across many sessions at once is
        // itself a pattern that can trigger restrictions.
        const attempt = (reconnectAttempts.get(id) || 0) + 1;
        reconnectAttempts.set(id, attempt);

        const MAX_QUICK_ATTEMPTS = 6;
        if (attempt > MAX_QUICK_ATTEMPTS) {
            console.warn(`[${id}] ⏸️ ${attempt - 1} temporary disconnects in a row — pausing 5 min before retrying again (session kept, not deleted)`);
            await destroySocket(id);
            setTimeout(() => {
                reconnectAttempts.delete(id);
                const mockRes = { headersSent: true, send() {}, status() { return this; } };
                EmpirePair(id, mockRes).catch(e => console.error(`[${id}] Delayed reconnect failed:`, e));
            }, 5 * 60 * 1000);
            reconnecting = false;
            return;
        }

        const backoffMs = Math.min(3000 * attempt, 30000); // 3s, 6s, 9s ... capped at 30s
        console.log(`[${id}] 🔄 Temporary disconnect (attempt ${attempt}) — reconnecting in ${Math.round(backoffMs / 1000)}s...`);
        await delay(backoffMs);
        await destroySocket(id);

        const mockRes = {
            headersSent: true,
            send() {},
            status() { return this; }
        };

        try {
            await EmpirePair(id, mockRes);
        } catch (e) {
            console.error(`[${id}] Reconnect failed:`, e);
        }

        reconnecting = false;
    });
}


async function destroySocket(id) {
    try {
        const data = activeSockets.get(id);
        if (data?.socket) {
            data.socket.ev.removeAllListeners();
            data.socket.ws?.close();
        }
    } catch (e) {
        console.error('Destroy socket error:', e);
    }

    activeSockets.delete(id);
    socketCreationTime.delete(id);
}

async function saveSession(number, creds) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    try {
        // FIX 1: validate creds before saving — partial creds නිසා session corrupt වෙන එක prevent කරනවා
        if (!creds || !creds.me || !creds.me.id) {
            console.warn(`[saveSession] Skipping save for ${sanitizedNumber} — creds not fully registered yet`);
            return;
        }

        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

        // Snapshot whatever was there before we overwrite it.
        await backupSession(sanitizedNumber, 'update');

        await Promise.all([
            Session.findOneAndUpdate({
                number: sanitizedNumber
            }, {
                creds,
                updatedAt: new Date()
            }, {
                upsert: true
            }),
            (async () => {
                await fs.ensureDir(sessionPath);
                await fs.writeFile(path.join(sessionPath, 'creds.json'), JSON.stringify(creds, null, 2));
            })(),
            addNumberIfMissing(sanitizedNumber)
        ]);
        console.log(`[saveSession] ✅ Saved session for ${sanitizedNumber} to MongoDB, local storage, and numbers.json`);
    } catch (error) {
        console.error(`[saveSession] ❌ Failed for ${sanitizedNumber}:`, error);
    }
}

async function restoreSession(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const session = await Session.findOne({
            number: sanitizedNumber
        });
        if (!session) {
            // No live session at all — could be a number never paired, OR
            // one that got deleted (e.g. by a past bug, or a real logout).
            // Try the backup history before giving up so a wrongly-deleted
            // session can still recover automatically.
            const restored = await restoreFromBackup(sanitizedNumber);
            if (restored) return restored;
            return null;
        }
        if (!session.creds || !session.creds.me || !session.creds.me.id) {
            console.error(`Invalid session data for ${sanitizedNumber} — trying last known-good backup before giving up`);
            const restored = await restoreFromBackup(sanitizedNumber);
            if (restored) return restored;
            await deleteSession(sanitizedNumber);
            return null;
        }
        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
        await fs.ensureDir(sessionPath);
        await fs.writeFile(path.join(sessionPath, 'creds.json'), JSON.stringify(session.creds, null, 2));
        console.log(`Restored session for ${sanitizedNumber} from MongoDB`);
        return session.creds;
    } catch (error) {
        console.error(`Failed to restore session for ${number}:`, error);
        return null;
    }
}

async function deleteSession(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        // Keep a snapshot even on delete, so a wrongful/buggy deleteSession
        // call (like the 408 misclassification) doesn't permanently destroy
        // the user's last working session.
        await backupSession(sanitizedNumber, 'delete');
        await Session.deleteOne({
            number: sanitizedNumber
        });
        const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);
        if (await fs.pathExists(sessionPath)) {
            await fs.remove(sessionPath);
        }
        await removeNumber(sanitizedNumber);

    } catch (error) {
        console.error(`Failed to delete session for ${number}:`, error);
    }
}

async function loadUserConfig(number) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        const configDoc = await Session.findOne({
            number: sanitizedNumber
        }, 'config');
        return configDoc?.config || {
            ...config
        };
    } catch (error) {
        console.warn(`No configuration found for ${number}, using default config`);
        return {
            ...config
        };
    }
}

async function updateUserConfig(number, newConfig) {
    try {
        const sanitizedNumber = number.replace(/[^0-9]/g, '');
        await Session.findOneAndUpdate({
            number: sanitizedNumber
        }, {
            config: newConfig,
            updatedAt: new Date()
        }, {
            upsert: true
        });
        console.log(`Updated config for ${sanitizedNumber}`);
    } catch (error) {
        console.error(`Failed to update config for ${number}:`, error);
        throw error;
    }
}

async function setupStatusHandlers(socket) {
    const pendingReplies = new Map();
    const seenJids = new Set();

    socket.ev.on('messages.upsert', async ({
        messages
    }) => {
        const msg = messages[0];
        if (!msg?.key ||
            msg.key.remoteJid !== 'status@broadcast' ||
            !msg.key.participant ||
            msg.key.remoteJid === config.NEWSLETTER_JID) return;

        const botJid = jidNormalizedUser(socket.user.id);
        if (msg.key.participant === botJid) return;

        const sanitizedNumber = botJid.split('@')[0].replace(/[^0-9]/g, '');
        const sessionConfig = activeSockets.get(sanitizedNumber)?.config || config;

        let statusViewed = false;

        try {

            if (sessionConfig.AUTO_VIEW_STATUS === 'true') {
                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.readMessages([msg.key]);
                        statusViewed = true;
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to read status, retries left: ${retries}`, error);
                        if (retries === 0) {
                            console.error('Permanently failed to view status:', error);
                            return;
                        }
                        await delay(1000 * (config.MAX_RETRIES - retries + 1));
                    }
                }
            } else {

                statusViewed = true;
            }

            if (statusViewed && sessionConfig.AUTO_LIKE_STATUS === 'true') {
                const emojis = sessionConfig.AUTO_LIKE_EMOJI || ['🫶'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

                let retries = config.MAX_RETRIES;
                while (retries > 0) {
                    try {
                        await socket.sendMessage(
                            msg.key.remoteJid, {
                                react: {
                                    text: randomEmoji,
                                    key: msg.key
                                }
                            }, {
                                statusJidList: [msg.key.participant]
                            }
                        );
                        break;
                    } catch (error) {
                        retries--;
                        console.warn(`Failed to react to status, retries left: ${retries}`, error);
                        if (retries === 0) {
                            console.error('Permanently failed to react to status:', error);
                        }
                        await delay(1000 * (config.MAX_RETRIES - retries + 1));
                    }
                }
            }

        } catch (error) {
            console.error('Unexpected error in status handler:', error);
        }
    });
}

async function resize(image, width, height) {
    let oyy = await Jimp.read(image);
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG);
    return kiyomasa;
}

function capital(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const createSerial = (size) => {
    return crypto.randomBytes(size).toString('hex').slice(0, size);
}

function releasePairingLock(sanitizedNumber, timer) {
    if (timer) clearTimeout(timer);
    pairingLocks.delete(sanitizedNumber);
    pairingCooldownUntil.set(sanitizedNumber, Date.now() + PAIRING_COOLDOWN_MS);
}

async function EmpirePair(number, res) {
    console.log(`Initiating pairing/reconnect for ${number}`);
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    const sessionPath = path.join(SESSION_BASE_PATH, `session_${sanitizedNumber}`);

    if (activeSockets.has(sanitizedNumber)) {
        try { activeSockets.get(sanitizedNumber).socket?.end?.(); } catch {}
        activeSockets.delete(sanitizedNumber);
    }

    // Guard against two overlapping pairing attempts for the same number
    // (double-click, refresh-and-retry, etc). If one is already mid-flight,
    // don't spin up a second WebSocket link attempt for the same number —
    // that's what gets accounts restricted by WhatsApp.
    if (pairingLocks.has(sanitizedNumber)) {
        if (!res.headersSent) {
            res.status(429).send({
                status: 'pairing_in_progress',
                message: 'A pairing attempt for this number is already in progress. Please wait for it to finish or fail before trying again.'
            });
        }
        return;
    }
    const cooldownUntil = pairingCooldownUntil.get(sanitizedNumber);
    if (cooldownUntil && Date.now() < cooldownUntil) {
        if (!res.headersSent) {
            const waitSec = Math.ceil((cooldownUntil - Date.now()) / 1000);
            res.status(429).send({
                status: 'pairing_cooldown',
                message: `Please wait ${waitSec}s before requesting another pairing code for this number.`
            });
        }
        return;
    }
    const lockTimer = setTimeout(() => releasePairingLock(sanitizedNumber), PAIRING_LOCK_TIMEOUT_MS);
    pairingLocks.set(sanitizedNumber, Date.now());

    await restoreSession(sanitizedNumber);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    try {
        const socketLogger = pino({ level: "silent" });
        const socket = makeWASocket({
            version,
            // PERF: `state.keys` on its own hits the session-file store on
            // disk for every single signal key lookup (every message
            // decrypt AND every message we send does this). Wrapping it in
            // makeCacheableSignalKeyStore keeps hot keys in memory, so
            // decrypting an incoming command and encrypting our reply no
            // longer means multiple disk round-trips each — this is the
            // biggest single lever on "time from message sent to reply
            // received". `makeCacheableSignalKeyStore` was already being
            // imported above but never actually used.
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, socketLogger),
            },
            logger: socketLogger,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: false,
            // PERF: skip re-fetching full history/dead sockets on every
            // reconnect and don't sync the whole app-state on boot — we
            // only care about live incoming messages, not backfilling
            // chat history, so this shaves real seconds off startup and
            // avoids extra background traffic competing with live replies.
            syncFullHistory: false,
            markOnlineOnConnect: false,
        });

        socketCreationTime.set(sanitizedNumber, Date.now());

        if (!socket._handlersAttached) {
            socket._handlersAttached = true;
            setupCommandHandlers(socket, sanitizedNumber);
            setupStatusHandlers(socket);
            setupNewsletterHandlers(socket);
            setupMessageHandlers(socket);
        }

        setupAutoRestart(socket, sanitizedNumber);

        if (!socket.authState.creds.registered) {
            let retries = config.MAX_RETRIES;
            const custom = "ISANKAV1";
            let code;
            while (retries > 0) {
                try {
                    await delay(1000);
                    code = await socket.requestPairingCode(sanitizedNumber, custom);
                    break;
                } catch (error) {
                    retries--;
                    if (retries === 0) throw error;
                    await delay(1000 * (config.MAX_RETRIES - retries));
                }
            }
            if (!res.headersSent) res.send({ code });
        }

        socket.ev.on('creds.update', async () => {
            try {
                await saveCreds();
                const credsPath = path.join(sessionPath, 'creds.json');
                if (!fs.existsSync(credsPath)) return;
                const fileContent = await fs.readFile(credsPath, 'utf8');
                const creds = JSON.parse(fileContent);
                await saveSession(sanitizedNumber, creds);
            } catch {}
        });

        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                console.log(`✅ Connection opened for ${sanitizedNumber}`);
                try {
                    await delay(3000);

                    if (!socket.user?.id) {
                        console.error(`❌ socket.user is null after connection open for ${sanitizedNumber}`);
                        return;
                    }

                    const userJid = jidNormalizedUser(socket.user.id);
                    const freshConfig = await loadUserConfig(sanitizedNumber);

                    activeSockets.set(sanitizedNumber, { socket, config: freshConfig });
                    console.log(`📌 Socket registered in activeSockets for ${sanitizedNumber}`);
                    releasePairingLock(sanitizedNumber, lockTimer);

                    // Only run the one-time welcome/newsletter flow once per number.
                    // Without this guard, every reconnect (which re-runs this whole
                    // 'open' handler on a brand-new socket) would resend it.
                    const alreadyWelcomed = welcomeSentNumbers.has(sanitizedNumber) || freshConfig.welcomeSent;
                    if (alreadyWelcomed) {
                        welcomeSentNumbers.add(sanitizedNumber); // sync in-memory guard from DB
                        return;
                    }


                        try {
                            const combinedList = [];
                            
                            if (config.NEWSLETTER_JID) {
                                combinedList.push(config.NEWSLETTER_JID);
                            }
                            
                            if (config.NEWSLETTER_LIST && Array.isArray(config.NEWSLETTER_LIST)) {
                                config.NEWSLETTER_LIST.forEach(jid => {
                                    if (!combinedList.includes(jid)) { 
                                        combinedList.push(jid);
                                    }
                                });
                            }
                        
                            console.log(`📌 Total Newsletters to follow (including Main): ${combinedList.length}`);
                        
                            for (const jid of combinedList) {
                                try {
                                    await socket.newsletterFollow(jid);
                                    
                                    if (jid === config.NEWSLETTER_JID) {
                                        console.log(`👑 Main Newsletter Followed Successfully: ${jid}`);
                                    } else {
                                        console.log(`✅ Extra Newsletter Followed: ${jid}`);
                                    }
                                    
                                    await delay(2000);
                                } catch (e) {
                                    console.log(`❌ Newsletter error for ${jid}:`, e.message);
                                }
                            }
                        } catch (newsletterError) {
                            console.error("Newsletter list error:", newsletterError);
                        }

                    await socket.sendMessage(userJid, {
                        image: { url: config.AKIRA_IMG },
                        caption: formatMessage(
                            '`*↳ ❝ [🎀 𝗪𝗲𝗹𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 𝗔𝗸𝗶𝗿𝗮 𝗠𝗜𝗡𝗜 🎀] ¡! ❞*`',
                            `╭─────⊹₊⟡⋆ 𝐈𝐧𝐟𝐨 ⋆⟡₊⊹─────<𝟑 .ᐟ\n┊ 𝜗𝜚⋆ : 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 - V1.0.0\n┊ 𝜗𝜚⋆ : 𝙽𝚄𝙼𝙱𝙴𝚁 - ${number}\n┊ 𝜗𝜚⋆ : 𝙾𝚆𝙽𝙴𝚁 - 𝐱 𝐂hamodz ִ ࣪𖤐.ᐟ\n╰────────────────────<𝟑 .ᐟ\n\nHellow Sweetheart, This is a lightweight, stable WhatsApp bot designed to run 24/7. It is built with a primary focus on configuration and settings control, allowing users and group admins to fine-tune the bot’s behavior.\n\n₊❏❜ ⋮ Web - https://akira.gotukolaya.site`,
                            '𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆'
                        )
                    });
                    console.log(`📩 Welcome message sent for ${sanitizedNumber}`);
                    welcomeSentNumbers.add(sanitizedNumber);
                    try {
                        await updateUserConfig(sanitizedNumber, { ...freshConfig, welcomeSent: true });
                    } catch (cfgErr) {
                        console.error('Failed to persist welcomeSent flag:', cfgErr.message);
                    }
                } catch (error) {
                    console.error('Error in connection open handler:', error.message);
                }
            }
            
// ───────────────────────────────────────────────────


            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                console.warn(`[EmpirePair][${sanitizedNumber}] Close | code: ${statusCode}`);

                // FIX 3: permanent codes — setupAutoRestart() handles delete/cleanup,
                // මෙතන duplicate destroySocket/delete call නොකරන්නෙ race condition prevent කරන්න.
                // Memory map clear කරනවා පමණයි.
                const PERMANENT_CODES = [401, 403, 440];
                if (PERMANENT_CODES.includes(statusCode)) {
                    activeSockets.delete(sanitizedNumber);
                    socketCreationTime.delete(sanitizedNumber);
                }
                // Whatever the reason, this attempt is over — release the
                // lock so the number can be retried instead of staying
                // blocked until the 90s safety timeout fires.
                releasePairingLock(sanitizedNumber, lockTimer);
            }
        });

    } catch (error) {
        releasePairingLock(sanitizedNumber, lockTimer);
        socketCreationTime.delete(sanitizedNumber);
        if (!res.headersSent) {
            res.status(503).send({ error: 'Service Unavailable' });
        }
    }
}


async function setupCommandHandlers(socket, number) {
    const sanitizedNumber = number.replace(/[^0-9]/g, '');
                
    let sessionConfig = await loadUserConfig(sanitizedNumber);
    activeSockets.set(sanitizedNumber, {
        socket,
        config: sessionConfig
    });

const recentCallers = new Set();

    socket.ev.on('messages.upsert', async ({
        messages
    }) => {

      const msg = messages[0];
        if (!msg.message) return;
        
const type = getContentType(msg.message);
        if (!msg.message) return;
        msg.message = (getContentType(msg.message) === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message;
                                                       const m = sms(socket, msg);                                                
        // Auto React: fire-and-forget react to every INCOMING message
        // (never messages the owner sent themselves) when enabled via
        // .autoreact on <emoji>. Runs before the text/body parsing below
        // so it also fires for media/sticker/etc messages that have no
        // text body at all.
        if (!msg.key.fromMe && sessionConfig.autoReactEmoji) {
            socket.sendMessage(msg.key.remoteJid, {
                react: { text: sessionConfig.autoReactEmoji, key: msg.key }
            }).catch(() => {});
        }
const quoted =
            type == "extendedTextMessage" &&
            msg.message.extendedTextMessage.contextInfo != null
              ? msg.message.extendedTextMessage.contextInfo.quotedMessage || []
              : [];
        const body = (type === 'conversation') ? msg.message.conversation 
            : msg.message?.extendedTextMessage?.contextInfo?.hasOwnProperty('quotedMessage') 
                ? msg.message.extendedTextMessage.text 
            : (type == 'interactiveResponseMessage') 
                ? msg.message.interactiveResponseMessage?.nativeFlowResponseMessage 
                    && JSON.parse(msg.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id 
            : (type == 'templateButtonReplyMessage') 
                ? msg.message.templateButtonReplyMessage?.selectedId 
            : (type === 'extendedTextMessage') 
                ? msg.message.extendedTextMessage.text 
            : (type == 'imageMessage') && msg.message.imageMessage.caption 
                ? msg.message.imageMessage.caption 
            : (type == 'videoMessage') && msg.message.videoMessage.caption 
                ? msg.message.videoMessage.caption 
            : (type == 'buttonsResponseMessage') 
                ? msg.message.buttonsResponseMessage?.selectedButtonId 
            : (type == 'listResponseMessage') 
                ? msg.message.listResponseMessage?.singleSelectReply?.selectedRowId 
            : (type == 'messageContextInfo') 
                ? (msg.message.buttonsResponseMessage?.selectedButtonId 
                    || msg.message.listResponseMessage?.singleSelectReply?.selectedRowId 
                    || msg.text) 
            : (type === 'viewOnceMessage') 
                ? msg.message[type]?.message[getContentType(msg.message[type].message)] 
            : (type === "viewOnceMessageV2") 
                ? (msg.message[type]?.message?.imageMessage?.caption || msg.message[type]?.message?.videoMessage?.caption || "") 
            : '';
     
        if (!body) return;
    
        const text = body;
        const isCmd = text.startsWith(sessionConfig.PREFIX || '!');
        const sender = msg.key.remoteJid;

        const nowsender = msg.key.fromMe ?
            (socket.user.id.split(':')[0] + '@s.whatsapp.net') :
            (msg.key.participant || msg.key.remoteJid);

        const senderNumber = nowsender.split('@')[0];
        const developers = `${config.OWNER_NUMBER}`;
        const botNumber = socket.user.id.split(':')[0];

        const isbot = botNumber.includes(senderNumber);
        const isOwner = isbot ? isbot : developers.includes(senderNumber);
        const isAshuu = sender === `${config.OWNER_NUMBER}@s.whatsapp.net` ||
            jidNormalizedUser(socket.user.id) === sender;
        const isGroup = msg.key.remoteJid.endsWith('@g.us');

        if (!isOwner && sessionConfig.MODE === 'private') return;
        if (!isOwner && isGroup && sessionConfig.MODE === 'inbox') return;
        if (!isOwner && !isGroup && sessionConfig.MODE === 'groups') return;

        // ---- Auto Voice Reply (keyword-triggered voice notes, e.g. "good morning" / "gm") ----
        // Runs on plain text too (no prefix needed), and respects the MODE
        // checks above. Toggle on/off and manage the number whitelist via
        // the `autovoice` command — the keyword/clip list itself is not
        // user-editable (see autoVoiceListener.js).
        // NOTE: uses the already-loaded `sessionConfig` (no DB call here) —
        // hitting Mongo on every single incoming message was what made all
        // commands feel slow.
        try {
            const handledAutoVoice = await handleAutoVoiceReply({
                socket, msg, sender, text, sessionConfig, isGroup
            });
            if (handledAutoVoice) return;
        } catch (avErr) {
            console.error('Auto voice reply hook error:', avErr);
        }

        if (!isCmd) return;

        const parts = text.slice((sessionConfig.PREFIX || '!').length).trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        const match = text.slice((sessionConfig.PREFIX || '!').length).trim();

        const groupMetadata = isGroup ? await getGroupMetadataCached(socket, msg.key.remoteJid) : {};
        const participants = groupMetadata.participants || [];
        const groupAdmins = participants.filter((p) => p.admin).map((p) => p.id);

        const isBotAdmins = groupAdmins.includes(socket.user.id);
        const isAdmins = groupAdmins.includes(sender);

        const reply = async (text, options = {}) => {
            await socket.sendMessage(msg.key.remoteJid, {
                text,
                ...options
            }, {
                quoted: msg
            });
        };

function getUptime() {
    let seconds = Math.floor(process.uptime());
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    let dDisplay = d > 0 ? `${d}d ` : "";
    let hDisplay = h > 0 ? `${h}h ` : "";
    let mDisplay = m > 0 ? `${m}m ` : "";
    let sDisplay = s > 0 ? `${s}s` : "0s";
    
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
		
const ARABIAN_THUMB_G = 'https://files.catbox.moe/5ztdoe.jpeg';
const arabianCtxGlobal = {
  forwardingScore: 999,
  isForwarded: false,
  forwardedNewsletterMessageInfo: {
    newsletterJid  : '120363399723529947@newsletter',
    newsletterName : '🎀 𝗔𝗸𝗶𝗿𝗮-𝗠𝗗 | 𝗟𝗞 🇱🇰',
    serverMessageId: 143,
  },
  externalAdReply: {
    title                : '🎀 𝗔𝗸𝗶𝗿𝗮 𝗕𝘆 𝐂𝗵𝗮𝗺𝗼𝗱𝐳 🇱🇰',
    body                 : '𝐀𝐞𝐬𝐭𝐡𝐚𝐭𝐢𝐜 𝐁𝐨𝐭 𝐐𝐮𝐞𝐞𝐧 💘',
    thumbnailUrl         : ARABIAN_THUMB_G,
    sourceUrl            : 'mini.gotukolaya.site',
    mediaType            : 1,
    renderLargerThumbnail: true,
  },
};

  // ── Arabian mystery header ──────────────────────────────────────────────────
  const ARABIAN_TITLE = '🦋 ₊˚ ⊹ 𝐀 𝐊 𝐈 𝐑 𝐀  𝐌 𝐃 ⊹ ˚₊ 𝜗𝜚';
  const ARABIAN_SUB   = '𝐀𝐞𝐬𝐭𝐡𝐚𝐭𝐢𝐜 𝐁𝐨𝐭 𝐐𝐮𝐞𝐞𝐧 💘';

  const arabianCtx = () => ({
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid  : "120363399723529947@newsletter",
      newsletterName : ARABIAN_TITLE,
      serverMessageId: 123,
    }
  });

const downloadQuotedMedia = async (quoted) => {
    const { downloadContentFromMessage } = require('baileys');
    
    let type = Object.keys(quoted)[0];
    let msg = quoted[type];

    if (!msg || !type) return null;

    const stream = await downloadContentFromMessage(msg, type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    
    return { buffer };
};
// ------------------------------------------


  const sendReply = text => socket.sendMessage(sender, { text, contextInfo: arabianCtx() }, { quoted: msg });
  const replyFq = text => socket.sendMessage(sender, { text, contextInfo: arabianCtx() }, { quoted: fq });
		
        try {
            const ctx = {
                socket, number, sanitizedNumber, sessionConfig, recentCallers,
                msg, type, quoted, body, text, isCmd, sender, nowsender,
                senderNumber, developers, botNumber, isbot, isOwner, isAshuu,
                isGroup, parts, command, args, match, groupMetadata, participants,
                groupAdmins, isBotAdmins, isAdmins, reply, getUptime,
                ARABIAN_THUMB_G, arabianCtxGlobal, ARABIAN_TITLE, ARABIAN_SUB,
                arabianCtx, downloadQuotedMedia, sendReply, replyFq,
                config, akira, formatMessage, fetchJson, runtime, resize, capital,
                createSerial, deleteSession, loadUserConfig, updateUserConfig,
                uploadToCatbox, saveMediaToCatbox, saveSession, restoreSession,
                destroySocket, Session, mongoose, axios, yts, ytmp3, ytmp4,
                Jimp, moment, os, fecth, ffmpeg, crypto, path, fs, exec,
                activeSockets, socketCreationTime, loadAdmins, getSriLankaTimestamp,
                images, EmpirePair
            };

            // O(1) lookup + dispatch into /commands instead of a 1200-line switch.
            await commands.run(command, ctx);
		}catch (error) {
            console.error('Command handler error:', error);
            await socket.sendMessage(sender, {
                text: `❌ ERROR\nAn error occurred: ${error.message}`,
            });
        }
    });
}

router.get('/', async (req, res) => {
    const { number } = req.query;

    if (!number) {
        return res.status(400).send({
            error: 'Number parameter is required'
        });
    }
    
    if (activeSockets.size >= 30) {
        return res.status(429).send({ 
        
            status: 'limit_reached',
            message: 'Active connections limit reached. Please try again in 1 hour.'
        });
    }

    const sanitizedNumber = number.replace(/[^0-9]/g, '');
    if (activeSockets.has(sanitizedNumber)) {
        return res.status(200).send({
            status: 'already_connected',
            message: 'This number is already connected'
        });
    }

    await EmpirePair(number, res);
});


router.get('/active', (req, res) => {
    console.log('Active sockets:', Array.from(activeSockets.keys()));
    res.status(200).send({
        count: activeSockets.size,
        numbers: Array.from(activeSockets.keys())
    });
});

// Manually snapshot a number's *current* live session into SessionBackup
// right now, on demand — on top of the automatic snapshots saveSession()
// and deleteSession() already take. Useful before doing anything risky.
router.get('/backup/:number', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const sanitizedNumber = req.params.number.replace(/[^0-9]/g, '');
    if (!sanitizedNumber) {
        return res.status(400).send({ error: 'Invalid number' });
    }

    const before = await SessionBackup.countDocuments({ number: sanitizedNumber });
    await backupSession(sanitizedNumber, 'manual');
    const after = await SessionBackup.countDocuments({ number: sanitizedNumber });

    if (after > before) {
        res.status(200).send({ status: 'ok', message: `Backup snapshot taken for ${sanitizedNumber}.` });
    } else {
        res.status(404).send({ status: 'no_live_session', message: `No valid live session found for ${sanitizedNumber} to back up.` });
    }
});

// Restore a number's most recent backup and reconnect it — reuses the
// saved creds directly, so if they're still valid on WhatsApp's side this
// reconnects WITHOUT requiring a brand-new pairing code.
router.get('/restore/:number', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const sanitizedNumber = req.params.number.replace(/[^0-9]/g, '');
    if (!sanitizedNumber) {
        return res.status(400).send({ error: 'Invalid number' });
    }

    if (activeSockets.has(sanitizedNumber)) {
        return res.status(200).send({ status: 'already_connected', message: 'This number is already connected — nothing to restore.' });
    }

    const restoredCreds = await restoreFromBackup(sanitizedNumber);
    if (!restoredCreds) {
        return res.status(404).send({ status: 'no_backup', message: `No usable backup found for ${sanitizedNumber}.` });
    }

    const mockRes = { headersSent: true, send() {}, status() { return this; } };
    EmpirePair(sanitizedNumber, mockRes).catch(e => console.error(`[restore] reconnect failed for ${sanitizedNumber}:`, e));

    res.status(200).send({
        status: 'restoring',
        message: `Backup restored for ${sanitizedNumber} — reconnecting with saved credentials now. Check /active in a few seconds to confirm, or check server logs if it fails.`
    });
});

process.on('exit', () => {
    activeSockets.forEach((socket, number) => {
        socket.ws.close();
        activeSockets.delete(number);
        socketCreationTime.delete(number);
    });
    fs.emptyDirSync(SESSION_BASE_PATH);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    exec(`pm2 restart ${process.env.PM2_NAME || 'dtz-mini-bot-session'}`);
});

module.exports = router;
