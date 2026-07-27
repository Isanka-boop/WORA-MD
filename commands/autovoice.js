/*
  Command: autovoice, avr
  Lets the bot owner (the person who paired the bot) turn the
  auto voice-reply feature on/off, and optionally restrict it to
  specific sender numbers.

  NOTE: This command intentionally does NOT expose the keyword -> audio
  mapping. That list lives only in autoVoiceListener.js so a normal user
  can never change/add/remove the trigger phrases or clips from chat.
*/
module.exports = {
    name: 'autovoice',
    aliases: ['avr'],
    execute: async (ctx) => {
        const {
            socket,
            msg,
            sender,
            sanitizedNumber,
            sessionConfig,
            args,
            reply,
            updateUserConfig
        } = ctx;

        {
        try {
            const sub = (args[0] || '').toLowerCase();

            // Mutate the shared, already-in-memory sessionConfig (same
            // object the auto-voice-reply hook reads on every message) so
            // the change takes effect immediately — then persist it to the
            // DB so it survives a reconnect. Reading it back from the DB
            // here would just be a slower, redundant copy of what we
            // already have in memory.
            const cfg = sessionConfig;
            if (cfg.autoVoiceReply === undefined) cfg.autoVoiceReply = true; // default ON when bot is paired
            if (!Array.isArray(cfg.autoVoiceNumbers)) cfg.autoVoiceNumbers = []; // empty = applies to everyone

            if (!sub || sub === 'status') {
                const state = cfg.autoVoiceReply ? '🟢 ON' : '🔴 OFF';
                const numbersText = cfg.autoVoiceNumbers.length
                    ? cfg.autoVoiceNumbers.map(n => `• ${n}`).join('\n')
                    : '_All numbers (no restriction)_';

                return reply(
                    `🎙️ *Auto Voice Reply Settings*\n\n` +
                    `> *Status :* ${state}\n` +
                    `> *Allowed Numbers :*\n${numbersText}\n\n` +
                    `*Commands:*\n` +
                    `• autovoice on\n` +
                    `• autovoice off\n` +
                    `• autovoice allow <number>\n` +
                    `• autovoice remove <number>\n` +
                    `• autovoice reset  _(clear whitelist, allow all)_`
                );
            }

            if (sub === 'on') {
                cfg.autoVoiceReply = true;
                await updateUserConfig(sanitizedNumber, cfg);
                return reply('✅ *Auto Voice Reply Enabled*');
            }

            if (sub === 'off') {
                cfg.autoVoiceReply = false;
                await updateUserConfig(sanitizedNumber, cfg);
                return reply('🛑 *Auto Voice Reply Disabled*');
            }

            if (sub === 'allow') {
                const num = (args[1] || '').replace(/[^0-9]/g, '');
                if (!num) return reply('❌ *Give a valid number.* Example: autovoice allow 947XXXXXXXX');
                if (!cfg.autoVoiceNumbers.includes(num)) cfg.autoVoiceNumbers.push(num);
                await updateUserConfig(sanitizedNumber, cfg);
                return reply(`✅ *${num} added to Auto Voice Reply whitelist.*\n_Only whitelisted numbers will trigger it now._`);
            }

            if (sub === 'remove') {
                const num = (args[1] || '').replace(/[^0-9]/g, '');
                if (!num) return reply('❌ *Give a valid number.* Example: autovoice remove 947XXXXXXXX');
                cfg.autoVoiceNumbers = cfg.autoVoiceNumbers.filter(n => n !== num);
                await updateUserConfig(sanitizedNumber, cfg);
                return reply(`✅ *${num} removed from whitelist.*`);
            }

            if (sub === 'reset') {
                cfg.autoVoiceNumbers = [];
                await updateUserConfig(sanitizedNumber, cfg);
                return reply('✅ *Whitelist cleared — now applies to all numbers.*');
            }

            return reply('❌ *Unknown option.* Use: on / off / allow / remove / reset / status');

        } catch (e) {
            console.log("AUTOVOICE CMD ERROR:", e);
            reply("❌ *Error: " + e.message + "*");
        }
        }
    }
};
