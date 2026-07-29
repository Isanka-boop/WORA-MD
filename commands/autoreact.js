/*
  Command: autoreact
  Lets each bot owner turn on auto-reacting to every INCOMING message
  their connected number receives (in DMs and groups) with a chosen
  emoji. Per-number setting, saved to that number's config, independent
  from every other paired number.

  The actual reacting happens in pair.js's main messages.upsert handler,
  which checks sessionConfig.autoReactEmoji on every incoming message.
*/
module.exports = {
    name: 'autoreact',
    aliases: ['autoreaction'],
    execute: async (ctx) => {
        const { sessionConfig, sanitizedNumber, updateUserConfig, args, reply, activeSockets, isOwner } = ctx;

        // Only the person who paired/connected this bot number (or a
        // global developer) may change its auto-react setting.
        if (!isOwner) {
            return reply('❌ *This command can only be used by the bot owner.*');
        }

        // Simple single-emoji check — one grapheme, no plain text sneaking
        // in as a "reaction" (WhatsApp reactions must be a single emoji).
        const isSingleEmoji = (str) => {
            if (!str) return false;
            const graphemes = Array.from(str.trim());
            if (graphemes.length !== 1) return false;
            return /\p{Extended_Pictographic}/u.test(graphemes[0]);
        };

        // The live socket entry in activeSockets can hold a *different*
        // config object than ctx.sessionConfig after a reconnect refresh —
        // sync both so the messages.upsert handler (which reads from the
        // socket's own sessionConfig closure) always sees the change
        // immediately, without waiting for the next reconnect.
        const syncEmoji = (emoji) => {
            const entry = activeSockets && activeSockets.get(sanitizedNumber);
            if (entry && entry.config) entry.config.autoReactEmoji = emoji;
        };

        try {
            const sub = (args[0] || '').toLowerCase();
            const cfg = sessionConfig;

            if (!sub || sub === 'status') {
                const state = cfg.autoReactEmoji ? `🟢 ON (${cfg.autoReactEmoji})` : '🔴 OFF';
                return reply(
                    `😍 *Auto React Settings*\n\n` +
                    `> *Status :* ${state}\n\n` +
                    `*Commands:*\n` +
                    `• autoreact on 😍\n` +
                    `• autoreact off`
                );
            }

            if (sub === 'on') {
                const emoji = args[1];
                if (!isSingleEmoji(emoji)) {
                    return reply('❌ *Give exactly one emoji.* Example: `autoreact on 😍`');
                }
                cfg.autoReactEmoji = emoji;
                await updateUserConfig(sanitizedNumber, cfg);
                syncEmoji(emoji);
                return reply(`✅ *Auto React turned ON.*\nEvery incoming message will now get a ${emoji} reaction.`);
            }

            if (sub === 'off') {
                cfg.autoReactEmoji = null;
                await updateUserConfig(sanitizedNumber, cfg);
                syncEmoji(null);
                return reply('✅ *Auto React turned OFF.*');
            }

            return reply('❌ *Unknown option.* Use: autoreact on <emoji> / off / status');

        } catch (e) {
            console.log('AUTOREACT CMD ERROR:', e);
            reply('❌ *Error: ' + e.message + '*');
        }
    }
};
