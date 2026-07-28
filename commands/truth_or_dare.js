/*
  Command: truthordare
  Fetches a random Truth or Dare prompt from hashu-apis.
*/
module.exports = {
    name: 'truthordare',
    aliases: ['tod', 'truth', 'dare'],
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
            // PERF: react is fire-and-forget so it can't block the reply.
            socket.sendMessage(sender, { react: { text: '🎲', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/truthordare?apiKey=${apiKey}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !data.results?.prompt) {
                    return reply('*🍓 Truth or Dare ප්‍රශ්නයක් ලබාගත නොහැකි විය.*');
                }

                const { type, prompt } = data.results;

                const isTruth = type === 'truth';

                const typeEmoji  = isTruth ? '💬' : '🔥';
                const typeLabelE = isTruth ? 'TRUTH' : 'DARE';
                const typeLabelS = isTruth ? 'සත්‍යය' : 'අභියෝගය';
                const typeColor  = isTruth ? '🔵' : '🔴';

                // Prompt සිංහලෙන් translate කරන්න Anthropic API use කරනවා
                let sinhalaPrompt = prompt;
                try {
                    const translateRes = await axios.post(
                        'https://api.anthropic.com/v1/messages',
                        {
                            model: 'claude-sonnet-4-6',
                            max_tokens: 1000,
                            messages: [{
                                role: 'user',
                                content: `පහත ඉංග්‍රීසි Truth or Dare ප්‍රශ්නය/අභියෝගය සිංහලට පරිවර්තනය කරන්න. පරිවර්තනය පමණක් ලියන්න, වෙනත් කිසිවක් එපා:\n\n${prompt}`
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
                    if (translated) sinhalaPrompt = translated;

                } catch (translateErr) {
                    console.error('[truthordare] translate error:', translateErr?.message || translateErr);
                    // translate fail උනොත් original English prompt එකම use කරනවා
                }

                const title = `*↳ ❝ [🎲 Truth or Dare 🎲] ¡! ❞*`;
                const content =
                    `*⊹₊⟡⋆ ⋮ වර්ගය ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ${typeColor} *${typeLabelE} — ${typeLabelS}* ${typeEmoji}\n\n` +
                    `*⊹₊⟡⋆ ⋮ ${typeLabelS} ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ${sinhalaPrompt}\n\n` +
                    `*⊹₊⟡⋆ ⋮ English ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ _${prompt}_\n`;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${content}\n${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[truthordare] error:', err?.message || err);
                await reply('*🍓 Truth or Dare ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
