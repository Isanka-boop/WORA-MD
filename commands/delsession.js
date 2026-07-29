/*
  Command: delsession
  Deletes a session (DB record + backup history + local files + numbers.json
  entry) and disconnects the live socket if one is active.

  Authorization: uses the bot's normal isOwner check (bot's own number, or
  config.OWNER_NUMBER) — same as every other owner-only command. There is
  intentionally no separate hardcoded number here anymore; a fixed number
  unrelated to config.OWNER_NUMBER would let whoever controls that number
  remotely wipe/kill any session on any deployment of this code, regardless
  of who actually owns the bot instance.
*/

module.exports = {
    name: 'delsession',
    aliases: ['deletesession', 'delses'],
    execute: async (ctx) => {
        const {
            senderNumber,
            sanitizedNumber,
            isOwner,
            args,
            reply,
            deleteSession,
            destroySocket,
            activeSockets
        } = ctx;

        try {
            if (!isOwner) {
                return reply('❌ *You are not authorized to use this command.*');
            }

            const targetNumber = (args[0] || sanitizedNumber).replace(/[^0-9]/g, '');
            if (!targetNumber) {
                return reply('📱 *Usage:* delsession <number>\n_(omit the number to delete the current session)_');
            }

            if (activeSockets.has(targetNumber)) {
                await destroySocket(targetNumber);
            }

            // permanent: true — purges backup history too, so the session
            // can't be silently auto-restored the next time this number
            // reconnects (see FIX in pair.js deleteSession()).
            await deleteSession(targetNumber, { permanent: true });

            return reply(`✅ *Session permanently deleted for ${targetNumber}.*`);

        } catch (e) {
            console.log("DELSESSION CMD ERROR:", e);
            reply("❌ *Error: " + e.message + "*");
        }
    }
};
