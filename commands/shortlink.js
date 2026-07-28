/*
  Command: fakeff
  Generates a Fake Free Fire lobby image using whiteshadow-x-api.
*/
module.exports = {
    name: 'fakeff',
    aliases: ['fakefrefire', 'fflobby', 'fakelo'],
    execute: async (ctx) => {
        const {
            socket,
            msg,
            sender,
            text,
            reply,
            arabianCtx,
            axios
        } = ctx;

        { // command body
            socket.sendMessage(sender, { react: { text: '🎮', key: msg.key } }).catch(() => {});

            const username = (text || '').trim();

            if (!username) {
                return reply(
                    '*↳ ❝ [🎮 Fake FF Lobby Maker] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ භාවිතය ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ *.fakeff <ඔබේ නම>*\n\n' +
                    '*⊹₊⟡⋆ ⋮ උදාහරණ ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ .fakeff WhiteShadow\n' +
                    '➜ .fakeff Chamod_FF\n' +
                    '➜ .fakeff AkiraGirl\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                );
            }

            // Processing message
            await socket.sendMessage(sender, {
                text:
                    '*↳ ❝ [🎮 Fake FF Lobby Maker] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ සකසමින් ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    `➜ 🎯 Username: *${username}*\n\n` +
                    '➜ ⏳ Lobby image සාදමින්...\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*',
                contextInfo: arabianCtx()
            }, { quoted: msg });

            try {
                const apiToken = 'aWK0z4';
                const endpoint = `https://whiteshadow-x-api.onrender.com/api/tools/fake-ff?username=${encodeURIComponent(username)}&apitoken=${apiToken}`;

                // API image buffer directly return කරනවා — arraybuffer ලෙස receive කරනවා
                const response = await axios.get(endpoint, {
                    responseType: 'arraybuffer',
                    timeout: 60000
                });

                // Content-Type check — image ද බලනවා
                const contentType = response.headers['content-type'] || 'image/png';
                if (!contentType.startsWith('image/')) {
                    return reply('*🍓 Fake FF Lobby image ලබාගත නොහැකි විය. නැවත උත්සාහ කරන්න.*');
                }

                const imageBuffer = Buffer.from(response.data);

                const caption =
                    `*↳ ❝ [🎮 Fake FF Lobby 🎮] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ Player ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ 👤 *${username}*\n\n` +
                    `*⊹₊⟡⋆ ⋮ සටහන ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ⚠️ _මෙය සාදන ලද Fake Lobby image එකකි. සැබෑ නොවේ._\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                await socket.sendMessage(sender, {
                    image: imageBuffer,
                    caption,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[fakeff] error:', err?.message || err);
                await reply('*🍓 Fake FF Lobby සෑදීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
