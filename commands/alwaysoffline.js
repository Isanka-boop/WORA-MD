/*
  Command: alwaysoffline
  Lets each bot owner force their OWN bot number to always show up as
  "offline"/unavailable on WhatsApp for everyone. Per-number setting,
  saved to that number's config, so it's independent from every other
  paired number.

  Mutually exclusive with alwaysonline — turning this on switches
  alwaysonline off automatically, and vice versa.
*/
module.exports = {
    name: 'alwaysoffline',
    aliases: ['offline'],
    execute: async (ctx) => {
        const { sessionConfig, sanitizedNumber, updateUserConfig, args, reply, activeSockets, isOwner } = ctx;

        // Only the person who paired/connected this bot number (or a
        // global developer) may change its presence setting — anyone
        // else messaging the bot is blocked from touching it.
        if (!isOwner) {
            return reply('❌ *This command can only be used by the bot owner.*');
        }

        // The live socket entry in activeSockets can hold a *different*
        // config object than ctx.sessionConfig after a reconnect refresh —
        // sync both so the background presence loop (which reads from
        // activeSockets) always sees the change immediately.
        const syncMode = (mode) => {
            const entry = activeSockets && activeSockets.get(sanitizedNumber);
            if (entry && entry.config) entry.config.presenceMode = mode;
        };

        try {
            const sub = (args[0] || '').toLowerCase();
            const cfg = sessionConfig;

            if (!sub || sub === 'status') {
                const state = cfg.presenceMode === 'offline' ? '🔴 ON' : '⚪ OFF';
                return reply(
                    `⚪ *Always Offline Settings*\n\n` +
                    `> *Status :* ${state}\n\n` +
                    `*Commands:*\n` +
                    `• alwaysoffline on\n` +
                    `• alwaysoffline off`
                );
            }

            if (sub === 'on') {
                cfg.presenceMode = 'offline';
                await updateUserConfig(sanitizedNumber, cfg);
                syncMode('offline');
                return reply(
                    '✅ *Always Offline turned ON.*\n' +
                    'Your bot will always show as offline to everyone.\n' +
                    '⚠️ _Note: WhatsApp won\'t show a "last seen" time while this is active either — it stays hidden._'
                );
            }

            if (sub === 'off') {
                if (cfg.presenceMode === 'offline') cfg.presenceMode = 'auto';
                await updateUserConfig(sanitizedNumber, cfg);
                syncMode('auto');
                return reply('✅ *Always Offline turned OFF.* Presence is back to normal.');
            }

            return reply('❌ *Unknown option.* Use: alwaysoffline on / off / status');

        } catch (e) {
            console.log('ALWAYSOFFLINE CMD ERROR:', e);
            reply('❌ *Error: ' + e.message + '*');
        }
    }
};
