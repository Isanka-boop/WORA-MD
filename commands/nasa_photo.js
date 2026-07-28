/*
  Command: nasa
  Fetches NASA's Astronomy Picture of the Day (APOD) from hashu-apis.
*/
module.exports = {
    name: 'nasa',
    aliases: ['apod'],
    execute: async (ctx) => {
        const {
            socket,
            msg,
            sender,
            reply,
            arabianCtx,
            axios
        } = ctx;

        { // command body
            // PERF: react is fire-and-forget so it can't block the reply.
            socket.sendMessage(sender, { react: { text: '🛰️', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/nasa?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !data.results) {
                    return reply('*🍓 Failed to fetch NASA Picture of the Day.*');
                }

                const { title, date, explanation, image } = data.results;

                // Trim explanation so caption doesn't get too long.
                const MAX_EXPLANATION_LEN = 700;
                const trimmedExplanation = explanation && explanation.length > MAX_EXPLANATION_LEN
                    ? explanation.slice(0, MAX_EXPLANATION_LEN).trim() + '...'
                    : explanation;

                const caption = `*↳ ❝ [🌌 𝗡𝗔𝗦𝗔 𝗣𝗶𝗰𝘁𝘂𝗿𝗲 𝗢𝗳 𝗧𝗵𝗲 𝗗𝗮𝘆 🌌] ¡! ❞*\n\n` +
                                 `*⊹₊⟡⋆ ⋮ Title:* ${title}\n` +
                                 `*⊹₊⟡⋆ ⋮ Date:* ${date}\n\n` +
                                 `*⊹₊⟡⋆ ⋮ Explanation ᶻ 𝗓 𐰁 .ᐟ*\n` +
                                 `➜ ${trimmedExplanation}\n\n` +
                                 `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                await socket.sendMessage(sender, {
                    image: { url: image },
                    caption,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[nasa] error:', err?.message || err);
                await reply('*🍓 Failed to fetch NASA Picture of the Day. Try again later.*');
            }
        }
    }
};
