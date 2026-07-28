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
            socket.sendMessage(sender, { react: { text: '🛰️', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/nasa?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !data.results) {
                    return reply('*🍓 NASA දිනයේ පින්තූරය ලබාගත නොහැකි විය.*');
                }

                const { title, date, explanation, image } = data.results;

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
                    const dayName = sinhalaDays[d.getUTCDay()];
                    const month = sinhalaMonths[d.getUTCMonth()];
                    const dayNum = d.getUTCDate();
                    const year = d.getUTCFullYear();
                    return `${dayName}, ${month} ${dayNum}, ${year}`;
                };

                // Explanation සිංහලෙන් translate කරන්න Anthropic API use කරනවා
                let sinhalaExplanation = explanation;
                try {
                    const MAX_CHARS = 800;
                    const trimmed = explanation && explanation.length > MAX_CHARS
                        ? explanation.slice(0, MAX_CHARS).trim() + '...'
                        : explanation;

                    const translateRes = await axios.post(
                        'https://api.anthropic.com/v1/messages',
                        {
                            model: 'claude-sonnet-4-6',
                            max_tokens: 1000,
                            messages: [{
                                role: 'user',
                                content: `පහත ඉංග්‍රීසි පාඨය සිංහලට පරිවර්තනය කරන්න. පරිවර්තනය පමණක් ලියන්න, වෙනත් කිසිවක් එපා:\n\n${trimmed}`
                            }]
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'anthropic-version': '2023-06-01'
                            },
                            timeout: 20000
                        }
                    );

                    const translated = translateRes?.data?.content?.[0]?.text?.trim();
                    if (translated) sinhalaExplanation = translated;

                } catch (translateErr) {
                    console.error('[nasa] translate error:', translateErr?.message || translateErr);
                    // translate fail උනොත් original English explanation එකම use කරනවා
                }

                const formattedDate = formatSinhalaDate(date);

                const caption =
                    `*↳ ❝ [🌌 නාසා අද දිනයේ තාරකා විද්‍යා පින්තූරය 🌌] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ මාතෘකාව:* ${title}\n` +
                    `*⊹₊⟡⋆ ⋮ දිනය:* ${formattedDate}\n\n` +
                    `*⊹₊⟡⋆ ⋮ විස්තරය ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ${sinhalaExplanation}\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                await socket.sendMessage(sender, {
                    image: { url: image },
                    caption,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[nasa] error:', err?.message || err);
                await reply('*🍓 නාසා පින්තූරය ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
