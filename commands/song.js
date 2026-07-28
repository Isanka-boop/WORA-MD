/*
  Command: song, ytmp3, play
  Uses WhiteShadow-X API for mp3 downloads
*/
module.exports = {
    name: 'song',
    aliases: ['ytmp3', 'play'],
    execute: async (ctx) => {
        const {
            socket,
            number,
            sanitizedNumber,
            sessionConfig,
            recentCallers,
            msg,
            type,
            quoted,
            body,
            text,
            isCmd,
            sender,
            nowsender,
            senderNumber,
            developers,
            botNumber,
            isbot,
            isOwner,
            isAshuu,
            isGroup,
            parts,
            command,
            args,
            match,
            groupMetadata,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
            getUptime,
            ARABIAN_THUMB_G,
            arabianCtxGlobal,
            ARABIAN_TITLE,
            ARABIAN_SUB,
            arabianCtx,
            downloadQuotedMedia,
            sendReply,
            replyFq,
            config,
            akira,
            formatMessage,
            fetchJson,
            runtime,
            resize,
            capital,
            createSerial,
            deleteSession,
            loadUserConfig,
            updateUserConfig,
            uploadToCatbox,
            saveMediaToCatbox,
            saveSession,
            restoreSession,
            destroySocket,
            Session,
            mongoose,
            axios,
            yts,
            ytmp3,
            ytmp4,
            Jimp,
            moment,
            os,
            fecth,
            ffmpeg,
            crypto,
            path,
            fs,
            exec,
            activeSockets,
            socketCreationTime,
            loadAdmins,
            getSriLankaTimestamp,
            images,
            EmpirePair
        } = ctx;

        { // command body (own scope, so locals can shadow ctx names)
        try {
            // ---- Parse args: "song <name> | <quality>" (quality optional, default 128) ----
            const rawInput = args.join(' ');
            if (!rawInput) return reply("🎵 *Plz Send Me A Song Name !*\n\n*Example:* song Attarintiki Daredi\n*With quality:* song Attarintiki Daredi | 320");

            let query = rawInput;
            let quality = '128';
            if (rawInput.includes('|')) {
                const splitParts = rawInput.split('|').map(p => p.trim());
                query = splitParts[0];
                const qArg = (splitParts[1] || '').replace(/[^0-9]/g, '');
                if (['64', '128', '192', '256', '320'].includes(qArg)) quality = qArg;
            }
            if (!query) return reply("🎵 *Plz Send Me A Song Name !*");

            try { await socket.sendMessage(sender, { react: { text: '🔎', key: msg.key } }); } catch (_) {}
            // Search + download can take a while — show the mic/"recording
            // audio" presence bubble so it's visibly still working instead
            // of looking dead.
            socket.sendPresenceUpdate('recording', sender).catch(() => {});

            // ---- Search YouTube ----
            const search = await yts(query);
            const video = search && search.videos && search.videos[0];
            if (!video) return reply("❌ *I Cant Find It !*");

            const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
            const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

            const searchCaption = `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗩𝗶𝗱𝗲𝗼 🎀] ¡! ❞*\n\n` +
                `> *\`🎵 𝚃𝙸𝚃𝙻𝙴 :\`* ${video.title}\n` +
                `> *\`👤 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 :\`* ${video.author.name}\n` +
                `> *\`⏱️ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽 :\`* ${video.timestamp}\n` +
                `> *\`👀 𝚅𝙸𝙴𝚆𝚂 :\`* ${video.views.toLocaleString()}\n` +
                `> *\`🎚️ 𝚀𝚄𝙰𝙻𝙸𝚃𝚈 :\`* ${quality}kbps\n` +
                `> *\`📅 𝙳𝙰𝚃𝙴 :\`* ${slDate}\n` +
                `> *\`⌚ 𝚃𝙸𝙼𝙴 :\`* ${slTimeNow}\n\n` +
                `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

            // ---- Buttons ----
            // Classic Baileys-fork "buttons" property — works on most patched
            // multi-device forks used in these bot bases. If your fork strips
            // buttons (some strict/newer WA versions do), it silently falls
            // back to a plain message — the try/catch below covers that.
            const songButtons = [
                { buttonId: `${command} ${query} | 128`, buttonText: { displayText: '🎧 128kbps' }, type: 1 },
                { buttonId: `${command} ${query} | 192`, buttonText: { displayText: '🎧 192kbps' }, type: 1 },
                { buttonId: `${command} ${query} | 320`, buttonText: { displayText: '🎚️ 320kbps' }, type: 1 }
            ];

            try {
                await socket.sendMessage(sender, {
                    image: { url: video.thumbnail },
                    caption: searchCaption,
                    footer: '🎀 Akira Girl Music',
                    buttons: songButtons,
                    headerType: 4,
                    contextInfo: arabianCtx()
                }, { quoted: msg });
            } catch (btnErr) {
                console.log("SONG BUTTON ERROR:", btnErr.message);
                await socket.sendMessage(sender, {
                    image: { url: video.thumbnail },
                    caption: searchCaption,
                    contextInfo: arabianCtx()
                }, { quoted: msg });
            }

            // ---- Call WhiteShadow-X API ----
            const API_TOKEN = 'aWK0z4';
            const apiUrl = `https://whiteshadow-x-api.onrender.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}&quality=${quality}&apitoken=${API_TOKEN}`;

            let apiData;
            try {
                const ytRes = await axios.get(apiUrl, { timeout: 60000 });
                apiData = ytRes.data;
            } catch (apiErr) {
                console.log("SONG API ERROR:", apiErr.message);
                return reply("❌ *Download Server Not Responding, Try Again Later !*");
            }

            if (!apiData || apiData.success === false) {
                return reply(`❌ *I cant get MP3 !* ${apiData && apiData.message ? '\n> ' + apiData.message : ''}`);
            }

            const result = apiData.result || apiData;
            const downloadUrl = result.download_url || result.url || result.downloadUrl;

            if (!downloadUrl) return reply("❌ *I cant get MP3 !*");

            const realTitle = result.title || video.title;
            const realDuration = result.duration || video.timestamp;
            const realQuality = result.quality || `${quality}kbps`;

            // ---- Check file size, fallback to document if too large for audio playback ----
            let fileSizeMB = null;
            try {
                const headRes = await axios.head(downloadUrl, { timeout: 15000 });
                const len = headRes.headers['content-length'];
                if (len) fileSizeMB = (parseInt(len, 10) / (1024 * 1024)).toFixed(2);
            } catch (_) {
                // ignore, some CDNs block HEAD requests
            }

            if (fileSizeMB && parseFloat(fileSizeMB) > 100) {
                await socket.sendMessage(sender, {
                    document: { url: downloadUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${realTitle}.mp3`,
                    caption: `📄 *File too large for audio player, sent as document (${fileSizeMB}MB)*`
                }, { quoted: msg });
            } else {
                await socket.sendMessage(sender, {
                    audio: { url: downloadUrl },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    fileName: `${realTitle}.mp3`
                }, { quoted: msg });
            }

            try { await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } }); } catch (_) {}

        } catch (e) {
            console.log("SONG CMD ERROR:", e);
            reply("❌ *Error: " + e.message + "*");
        } finally {
            socket.sendPresenceUpdate('paused', sender).catch(() => {});
        }
        }
    }
};
