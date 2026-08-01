/*
  autoVoiceListener.js

  This is NOT a user command. Call handleAutoVoiceReply(ctx) from inside
  your main message handler (the messages.upsert listener in pair.js /
  index.js) BEFORE or alongside your normal command dispatch — it works
  on plain text, no command prefix needed.

  The keyword -> voice clip map below is hardcoded on purpose. There is
  no command anywhere that edits this list, so a regular user cannot
  add/remove/change trigger phrases or clips — only turn the whole
  feature on/off and restrict it to certain numbers (DMs) or groups via
  `autovoice`.

  Groups are opt-IN only: a group only gets auto-voice replies after
  someone runs `autovoice group` inside that group, which adds that
  group's JID to sessionConfig.autoVoiceGroups. Personal DMs use the
  separate autoVoiceNumbers whitelist instead (empty = all DMs allowed).

  Usage inside your upsert handler, roughly (pass the already-loaded
  sessionConfig and isGroup — do NOT call loadUserConfig here, that's
  what made every command slow):

      const { handleAutoVoiceReply } = require('./autoVoiceListener');
      ...
      const handled = await handleAutoVoiceReply({
          socket, msg, sender, text, sessionConfig, isGroup
      });
      if (handled) return; // don't also run it through command dispatch
*/

// ---- Fixed, non-editable keyword -> voice clip map ----
// `text` is optional per entry. If present, it's sent together with the
// voice clip. Leave it out (or set to '') for voice-only, like before.
const AUTO_VOICE_REPLIES = [
    {
        keywords: ['good morning', 'gm'],
        url: 'https://files.catbox.moe/2o6k2l.ogg',
        text: '*සුබ උදෑසනක් 🥲*'
    },
    {
        keywords: ['mokada karanne', 'mk'],
        url: 'https://files.catbox.moe/zhfoxx.ogg',
        text: '*Mn ❗*'
    },
    {
        keywords: ['හායි' , 'Hy'],
        url: '',
        text: '*Hi 🦋*'
    },
    {
        keywords: ['ponnaya'],
        url: '',
        text: '*කවුද හුත්තෝ පොන්නයා තොපේ සියානෙ පොන්නයා 🤬*'
    },
    {
        keywords: ['Hm'],
        url: 'https://files.catbox.moe/t7l65q.ogg',
        text: '*හ්ම් තමා 🫡🩵*'
    }   
    
  ];

// Build a matcher once: exact-word match (not "substring anywhere"),
// so "gm" doesn't fire on "programming" or "mk" on "mkdir" etc.
function findMatch(rawText) {
    if (!rawText) return null;
    const text = rawText.trim().toLowerCase();

    for (const entry of AUTO_VOICE_REPLIES) {
        for (const kw of entry.keywords) {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`(^|\\s)${escaped}(\\s|$|[!.?])`, 'i');
            if (pattern.test(text)) return entry;
        }
    }
    return null;
}

/**
 * Call this from your main message handler.
 * Returns true if it handled (sent) an auto voice reply, false otherwise.
 *
 * PERFORMANCE NOTE: this runs on every single incoming message, so it must
 * stay cheap. Do the regex match FIRST (in-memory, no I/O) and only then
 * look at config — and read config straight off the already-loaded
 * `sessionConfig` object instead of hitting the database. A per-message
 * DB call here was previously what made every command feel slow.
 */
async function handleAutoVoiceReply({ socket, msg, sender, text, sessionConfig, isGroup }) {
    try {
        if (!text) return false;

        // Cheapest check first: most messages won't match any keyword at all.
        const match = findMatch(text);
        if (!match) return false;

        const cfg = sessionConfig || {};
        const enabled = cfg.autoVoiceReply !== false; // default ON
        if (!enabled) return false;

        if (isGroup) {
            // Groups are opt-IN only: a group must be explicitly added via
            // `autovoice group` (run inside that group) before it triggers.
            // `sender` here is the group JID (msg.key.remoteJid) since the
            // handler is called with the chat JID, not the participant.
            const allowedGroups = Array.isArray(cfg.autoVoiceGroups) ? cfg.autoVoiceGroups : [];
            if (!allowedGroups.includes(sender)) return false;
        } else {
            const allowedNumbers = Array.isArray(cfg.autoVoiceNumbers) ? cfg.autoVoiceNumbers : [];
            if (allowedNumbers.length > 0) {
                // Whitelist active: only these numbers trigger it.
                const senderNum = (sender || '').replace(/[^0-9]/g, '');
                const isWhitelisted = allowedNumbers.some(n => senderNum.endsWith(n) || n.endsWith(senderNum));
                if (!isWhitelisted) return false;
            }
        }

        // Send the text first (if this entry has one), then the voice clip,
        // so they arrive together as a pair for the same trigger.
        if (match.text) {
            await socket.sendMessage(sender, { text: match.text }, { quoted: msg });
        }

        await socket.sendMessage(sender, {
            audio: { url: match.url },
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: msg });

        return true;
    } catch (e) {
        console.log("AUTO VOICE REPLY ERROR:", e);
        return false;
    }
}

module.exports = { handleAutoVoiceReply, AUTO_VOICE_REPLIES };

