/*
  Command: shortlink
  Shortens a URL using spoo.me via whiteshadow-x-api.
*/
module.exports = {
    name: 'shortlink',
    aliases: ['shorten', 'short', 'url'],
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
            socket.sendMessage(sender, { react: { text: '🔗', key: msg.key } }).catch(() => {});

            const inputUrl = (text || '').trim();

            if (!inputUrl) {
                return reply(
                    '*↳ ❝ [🔗 URL කෙටි කිරීම] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ භාවිතය ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ *.shortlink <URL>*\n\n' +
                    '*⊹₊⟡⋆ ⋮ උදාහරණ ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ .shortlink https://github.com\n' +
                    '➜ .shortlink https://youtube.com/watch?v=xyz\n' +
                    '➜ .shortlink https://www.google.com\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                );
            }

            // Basic URL validation
            const urlPattern = /^https?:\/\/.+/i;
            if (!urlPattern.test(inputUrl)) {
                return reply(
                    '*🍓 වලංගු URL එකක් ඇතුළු කරන්න.*\n' +
                    '➜ URL එක *https://* හෝ *http://* ලෙස ආරම්භ වීම අනිවාර්යයි.\n\n' +
                    '*උදාහරණය:* .shortlink https://youtube.com'
                );
            }

            try {
                const apiToken = 'aWK0z4';
                const endpoint = `https://whiteshadow-x-api.onrender.com/api/tools/shortlink?apitoken=${apiToken}&url=${encodeURIComponent(inputUrl)}`;

                const { data } = await axios.get(endpoint, { timeout: 30000 });

                if (!data || data.success !== true || !data.short_url) {
                    return reply('*🍓 URL කෙටි කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
                }

                const { original_url, short_url } = data;

                // FIX: 'text' variable name conflict — ctx.text shadow කරන නිසා
                // msgText ලෙස rename කළා
                const msgText =
                    `*↳ ❝ [🔗 URL කෙටි කිරීම 🔗] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ මුල් URL ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ${original_url}\n\n` +
                    `*⊹₊⟡⋆ ⋮ කෙටි URL ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ 🔗 *${short_url}*\n\n` +
                    `*⊹₊⟡⋆ ⋮ සේවාව ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ 🌐 Spoo.me URL Shortener\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                await socket.sendMessage(sender, {
                    text: msgText,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[shortlink] error:', err?.message || err);
                await reply('*🍓 URL කෙටි කිරීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
