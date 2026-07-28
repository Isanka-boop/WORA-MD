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
            // PERF: react is fire-and-forget so it can't block the reply.
            socket.sendMessage(sender, { react: { text: '📅', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/holidays?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !Array.isArray(data.results) || data.results.length === 0) {
                    return reply('*🍓 No public holidays found.*');
                }

                // Only show "Public" type holidays to keep the list clean and relevant.
                const publicHolidays = data.results.filter(h =>
                    Array.isArray(h.types) && h.types.includes('Public')
                );

                const list = publicHolidays.length ? publicHolidays : data.results;

                // Limit how many entries we list so the message doesn't get too long.
                const MAX_ITEMS = 20;
                const items = list.slice(0, MAX_ITEMS);

                const countryCode = items[0]?.countryCode || 'N/A';

                let body = '';
                for (const h of items) {
                    const formattedDate = moment(h.date).isValid()
                        ? moment(h.date).format('MMM D, YYYY (ddd)')
                        : h.date;

                    body += `*⊹₊⟡⋆ ⋮ ${h.localName}*\n` +
                            `➜ 📆 ${formattedDate}\n\n`;
                }

                const title = `*↳ ❝ [📅 𝗣𝘂𝗯𝗹𝗶𝗰 𝗛𝗼𝗹𝗶𝗱𝗮𝘆𝘀 (${countryCode}) 📅] ¡! ❞*`;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${body}${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[holidays] error:', err?.message || err);
                await reply('*🍓 Failed to fetch public holidays. Try again later.*');
            }
        }
    }
};
