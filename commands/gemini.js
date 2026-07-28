/*
  Command: gemini
  Chat with Google Gemini AI using whiteshadow-x-api.
*/
module.exports = {
    name: 'gemini',
    aliases: ['ai', 'ask', 'chat'],
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
            socket.sendMessage(sender, { react: { text: '🤖', key: msg.key } }).catch(() => {});

            const question = (text || '').trim();

            if (!question) {
                return reply(
                    '*↳ ❝ [🤖 Gemini AI 🤖] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ භාවිතය ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ *.gemini <ඔබේ ප්‍රශ්නය>*\n\n' +
                    '*⊹₊⟡⋆ ⋮ උදාහරණ ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ .gemini සිංහල ඉතිහාසය ගැන කියන්න\n' +
                    '➜ .gemini write a poem about rain\n' +
                    '➜ .gemini what is quantum physics?\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                );
            }

            // Processing message — AI response ලැබෙන්න time යනවා නිසා
            await socket.sendMessage(sender, {
                text:
                    '*↳ ❝ [🤖 Gemini AI ] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ සිතමින් ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    `➜ 💭 "${question}"\n\n` +
                    '➜ ⏳ කරුණාකර රැඳී සිටින්න...\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*',
                contextInfo: arabianCtx()
            }, { quoted: msg });

            try {
                const apiToken = 'aWK0z4';
                const endpoint = `https://whiteshadow-x-api.onrender.com/api/ai/gemini?apitoken=${apiToken}&q=${encodeURIComponent(question)}`;

                const { data } = await axios.get(endpoint, { timeout: 60000 });

                if (!data || data.success !== true || !data.result?.response) {
                    return reply('*🍓 Gemini AI වෙතින් පිළිතුරක් ලබාගත නොහැකි විය.*');
                }

                const { model, response } = data.result;

                // Markdown cleanup — WhatsApp ට ### headers, ** bold support නෑ
                const cleanResponse = response
                    .replace(/^#{1,6}\s+/gm, '')       // ### headers remove
                    .replace(/\*\*(.*?)\*\*/g, '*$1*')  // **bold** → *bold* (WhatsApp bold)
                    .replace(/__(.*?)__/g, '_$1_')      // __italic__ → _italic_
                    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/`{3}\w*\n?/, '```\n').trimEnd()) // code blocks
                    .trim();

                // Response දිග limit — WhatsApp message limit 65536 chars
                const MAX_LEN = 3000;
                const trimmedResponse = cleanResponse.length > MAX_LEN
                    ? cleanResponse.slice(0, MAX_LEN).trim() + '\n\n_... (දිගු නිසා කපා ඇත)_'
                    : cleanResponse;

                const title = `*↳ ❝ [🤖 Gemini AI 🤖] ¡! ❞*`;
                const content =
                    `*⊹₊⟡⋆ ⋮ ඔබේ ප්‍රශ්නය ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ _${question}_\n\n` +
                    `*⊹₊⟡⋆ ⋮ Gemini පිළිතුර ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `${trimmedResponse}\n\n` +
                    `*⊹₊⟡⋆ ⋮ Model ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ \`${model || 'gemini'}\`\n`;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${content}\n${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[gemini] error:', err?.message || err);
                await reply('*🍓 Gemini AI සමඟ සම්බන්ධ වීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
