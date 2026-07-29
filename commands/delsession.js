/*
  Command: delsession
  Deletes a session (DB record + local files + numbers.json entry) and
  disconnects the live socket if one is active.

  HARD-RESTRICTED: only 94763353368 can run this, regardless of isOwner/
  MODE/anything else. This is intentionally NOT the generic isOwner
  check (which is per-bot-instance / config.OWNER_NUMBER) — only the
  one number below is allowed, full stop.
*/

const AUTHORIZED_NUMBER = '94765901096';

module.exports = {
    name: 'delsession',
    aliases: ['deletesession', 'delses'],
    execute: async (ctx) => {
        const {
            senderNumber,
            sanitizedNumber,
            args,
            reply,
            deleteSession,
            destroySocket,
            activeSockets
        } = ctx;

        {
        try {
            if (senderNumber !== AUTHORIZED_NUMBER) {
                return reply('❌ *You are not authorized to use this command.*');
            }

            const targetNumber = (args[0] || sanitizedNumber).replace(/[^0-9]/g, '');
            if (!targetNumber) {
                return reply('📱 *Usage:* delsession <number>\n_(omit the number to delete the current session)_');
            }

            if (activeSockets.has(targetNumber)) {
                await destroySocket(targetNumber);
            }

            await deleteSession(targetNumber);

            return reply(`✅ *Session deleted for ${targetNumber}.*`);

        } catch (e) {
            console.log("DELSESSION CMD ERROR:", e);
            reply("❌ *Error: " + e.message + "*");
        }
        }
    }
};
