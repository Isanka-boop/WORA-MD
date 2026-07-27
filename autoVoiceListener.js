/*
  autoVoiceListener.js

  This is NOT a user command. Call handleAutoVoiceReply(ctx) from inside
  your main message handler (the messages.upsert listener in pair.js /
  index.js) BEFORE or alongside your normal command dispatch — it works
  on plain text, no command prefix needed.

  The keyword -> voice clip map below is hardcoded on purpose. There is
  no command anywhere that edits this list, so a regular user cannot
  add/remove/change trigger phrases or clips — only turn the whole
  feature on/off and restrict it to certain numbers via `autovoice`.

  Usage inside your upsert handler, roughly:

      const { handleAutoVoiceReply } = require('./autoVoiceListener');
      ...
      const handled = await handleAutoVoiceReply({
          socket, msg, sender, sanitizedNumber, text, loadUserConfig
      });
      if (handled) return; // don't also run it through command dispatch
*/

// ---- Fixed, non-editable keyword -> voice clip map ----
const AUTO_VOICE_REPLIES = [
    {
        keywords: ['good morning', 'gm'],
        url: 'https://files.catbox.moe/2o6k2l.ogg'
    },
    {
        keywords: ['mokada karanne', 'mk'],
        url: 'https://files.catbox.moe/zhfoxx.ogg'
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
 */
async function handleAutoVoiceReply({ socket, msg, sender, sanitizedNumber, text, loadUserConfig }) {
    try {
        if (!text) return false;

        const match = findMatch(text);
        if (!match) return false;

        // Respect the per-user on/off + whitelist settings.
        let cfg = null;
        try {
            cfg = await loadUserConfig(sanitizedNumber);
        } catch (_) {
            cfg = null;
        }

        const enabled = cfg ? (cfg.autoVoiceReply !== false) : true; // default ON
        if (!enabled) return false;

        const allowedNumbers = (cfg && Array.isArray(cfg.autoVoiceNumbers)) ? cfg.autoVoiceNumbers : [];
        if (allowedNumbers.length > 0) {
            // Whitelist active: only these numbers trigger it.
            const senderNum = (sender || '').replace(/[^0-9]/g, '');
            const isWhitelisted = allowedNumbers.some(n => senderNum.endsWith(n) || n.endsWith(senderNum));
            if (!isWhitelisted) return false;
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
