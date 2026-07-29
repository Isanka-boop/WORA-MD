/*
  Command: alwaysonline
  Lets each bot owner force their OWN bot number to always show up as
  "online" (green dot) on WhatsApp for everyone. Per-number setting,
  saved to that number's config, so it's independent from every other
  paired number.

  The actual presence is kept alive by the background loop in
  pair.js (maintainPresenceLoop) since a single sendPresenceUpdate()
  call only lasts ~10 seconds on WhatsApp's side.
*/
module.exports = {
    name: 'alwaysonline',
    aliases: ['online'],
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
                const state = cfg.presenceMode === 'online' ? '🟢 ON' : '🔴 OFF';
                return reply(
                    `🟢 *Always Online Settings*\n\n` +
                    `> *Status :* ${state}\n\n` +
                    `*Commands:*\n` +
                    `• alwaysonline on\n` +
                    `• alwaysonline off`
                );
            }

            if (sub === 'on') {
                cfg.presenceMode = 'online';
                await updateUserConfig(sanitizedNumber, cfg);
                syncMode('online');
                return reply(
                    '✅ *Always Online turned ON.*\n' +
                    'Your bot will always show as online to everyone.\n' +
                    '⚠️ _Note: WhatsApp won\'t show an accurate "last seen" time while this is active._'
                );
            }

            if (sub === 'off') {
                if (cfg.presenceMode === 'online') cfg.presenceMode = 'auto';
                await updateUserConfig(sanitizedNumber, cfg);
                syncMode('auto');
                return reply('✅ *Always Online turned OFF.* Presence is back to normal.');
            }

            return reply('❌ *Unknown option.* Use: alwaysonline on / off / status');

        } catch (e) {
            console.log('ALWAYSONLINE CMD ERROR:', e);
            reply('❌ *Error: ' + e.message + '*');
        }
    }
};
