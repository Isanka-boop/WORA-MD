/*
  Command: pair
  Lets any user request a WhatsApp pairing code for a number
  straight from chat, instead of using the web pairing page.
*/
module.exports = {
    name: 'pair',
    aliases: ['pairnumber', 'addnumber'],
    execute: async (ctx) => {
        const {
            socket,
            number,
            sanitizedNumber,
            sessionConfig,
            msg,
            sender,
            senderNumber,
            args,
            reply,
            EmpirePair
        } = ctx;

        try {
            const targetNumber = (args[0] || '').replace(/[^0-9]/g, '');
            if (!targetNumber) {
                return reply('📱 *ZETA-MD Usage:* pair <number with country code>\n*Example:* pair 94771234567');
            }

            await reply(`⏳ *[ZETA-MD] Requesting pairing code for ${targetNumber} ...*`);

            let capturedCode = null;
            let capturedError = null;

            // EmpirePair(number, res) normally replies over HTTP via
            // res.send({ code }). We hand it a fake "res" so we can grab
            // the code and send it back over WhatsApp chat instead.
            const mockRes = {
                headersSent: false,
                send(payload) {
                    capturedCode = payload && payload.code;
                    this.headersSent = true;
                },
                status() { return this; }
            };

            try {
                await EmpirePair(targetNumber, mockRes);
            } catch (e) {
                capturedError = e.message;
            }

            if (capturedCode) {
                return reply(
                    `🔗 *ZETA-MD Pairing Code:* \`${capturedCode}\`\n\n` +
                    `*Steps:*\n` +
                    `1. WhatsApp > Linked Devices\n` +
                    `2. Link a Device > Link with phone number instead\n` +
                    `3. Enter this code on ${targetNumber}'s phone\n\n` +
                    `⏱️ _Code expires quickly, use it fast._`
                );
            }

            if (capturedError) {
                return reply(`❌ *ZETA-MD Pairing failed:* ${capturedError}`);
            }

            return reply(`✅ *${targetNumber} is already registered in ZETA-MD.* Reconnect attempted.`);

        } catch (e) {
            console.log("ZETA-MD PAIR CMD ERROR:", e);
            reply("❌ *ZETA-MD Error: " + e.message + "*");
        }
    }
};
