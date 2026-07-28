/*
  Command: currencylist
  Fetches the list of supported currency codes from hashu-apis.
*/
module.exports = {
    name: 'currencylist',
    aliases: ['currencies', 'currlist'],
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
            socket.sendMessage(sender, { react: { text: '💱', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/currencylist?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !data.results || typeof data.results !== 'object') {
                    return reply('*🍓 මුදල් කේත ලැයිස්තුව ලබාගත නොහැකි විය.*');
                }

                const entries = Object.entries(data.results);

                if (entries.length === 0) {
                    return reply('*🍓 මුදල් කේත ලැයිස්තුව හිස්ය.*');
                }

                // Build currency list rows
                let body = '';
                for (const [code, name] of entries) {
                    body += `➜ *${code}* — ${name}\n`;
                }

                const title = `*↳ ❝ [💱 සහාය දක්වන මුදල් ලැයිස්තුව 💱] ¡! ❞*`;
                const content =
                    `*⊹₊⟡⋆ ⋮ මුදල් කේත ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ මුළු සහාය දක්වන මුදල් ගණන: *${entries.length}*\n\n` +
                    `*⊹₊⟡⋆ ⋮ ලැයිස්තුව ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    body;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${content}\n${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[currencylist] error:', err?.message || err);
                await reply('*🍓 මුදල් ලැයිස්තුව ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
