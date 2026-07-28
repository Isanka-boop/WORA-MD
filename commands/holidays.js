/*
  Command: holidays
  Fetches public holidays from hashu-apis.
*/
module.exports = {
    name: 'holidays',
    aliases: ['publicholidays'],
    execute: async (ctx) => {
        const {
            socket,
            msg,
            sender,
            reply,
            arabianCtx,
            axios,
            moment
        } = ctx;

        { // command body
            socket.sendMessage(sender, { react: { text: '📅', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/holidays?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !Array.isArray(data.results) || data.results.length === 0) {
                    return reply('*🍓 රජයේ නිවාඩු දිනයන් සොයාගත නොහැකි විය.*');
                }

                const publicHolidays = data.results.filter(h =>
                    Array.isArray(h.types) && h.types.includes('Public')
                );

                const list = publicHolidays.length ? publicHolidays : data.results;
                const MAX_ITEMS = 20;
                const items = list.slice(0, MAX_ITEMS);

                const countryCode = items[0]?.countryCode || 'N/A';

                // සිංහල මාස නාම
                const sinhalaMonths = [
                    'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්',
                    'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු',
                    'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
                ];

                // සිංහල සතිය නාම
                const sinhalaDays = [
                    'ඉරිදා', 'සදුදා', 'අඟහරුවාදා', 'බදාදා',
                    'බ්‍රහස්පතින්දා', 'සිකුරාදා', 'සෙනසුරාදා'
                ];

                const formatSinhalaDate = (dateStr) => {
                    const d = new Date(dateStr);
                    if (isNaN(d)) return dateStr;
                    const day = sinhalaDays[d.getUTCDay()];
                    const month = sinhalaMonths[d.getUTCMonth()];
                    const date = d.getUTCDate();
                    const year = d.getUTCFullYear();
                    return `${day}, ${month} ${date}, ${year}`;
                };

                let body = '';
                for (const h of items) {
                    body += `*⊹₊⟡⋆ ⋮ ${h.localName}*\n` +
                            `➜ 📆 ${formatSinhalaDate(h.date)}\n\n`;
                }

                const title = `*↳ ❝ [📅 රජයේ නිවාඩු දිනයන් (${countryCode}) 📅] ¡! ❞*`;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${body}${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[holidays] error:', err?.message || err);
                await reply('*🍓 රජයේ නිවාඩු දිනයන් ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
