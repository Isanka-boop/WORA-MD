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
            socket.sendMessage(sender, { react: { text: '🤖', key: msg.key } }).catch(() => {});

            const question = (text || '').trim();

            if (!question) {
                return reply(
                    '*↳ ❝ [🤖 Gemini AI චැට්] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ භාවිතය ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ *.gemini <ඔබේ ප්‍රශ්නය>*\n\n' +
                    '*⊹₊⟡⋆ ⋮ උදාහරණ ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ .gemini සිංහල ඉතිහාසය ගැන කියන්න\n' +
                    '➜ .gemini write a poem about rain\n' +
                    '➜ .gemini what is quantum physics?\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                );
            }

            // Processing message
            await socket.sendMessage(sender, {
                text:
                    '*↳ ❝ [🤖 Gemini AI 🤖] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ සිතමින් ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    `➜ 💭 "${question}"\n\n` +
                    '➜ ⏳ කරුණාකර රැඳී සිටින්න...\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*',
                contextInfo: arabianCtx()
            }, { quoted: msg });

            try {
                const apiToken = 'aWK0z4';

                const systemInstruction = `You are a helpful AI assistant. Answer ONLY the user's question directly and clearly. Do NOT mention your name, model name, "Gemini", ".gemini", command names, or any meta information about yourself. Just answer what is asked.`;

                const cleanQuestion = question.replace(/^\.gemini\s*/i, '').trim();
                const fullPrompt = `${systemInstruction}\n\nUser question: ${cleanQuestion}`;

                const endpoint = `https://whiteshadow-x-api.onrender.com/api/ai/gemini?apitoken=${apiToken}&q=${encodeURIComponent(fullPrompt)}`;

                const { data } = await axios.get(endpoint, { timeout: 60000 });

                if (!data || data.success !== true || !data.result?.response) {
                    return reply('*🍓 Gemini AI වෙතින් පිළිතුරක් ලබාගත නොහැකි විය.*');
                }

                const { model, response } = data.result;

                // Markdown cleanup
                const cleanResponse = response
                    .replace(/^#{1,6}\s+/gm, '')
                    .replace(/\*\*(.*?)\*\*/g, '*$1*')
                    .replace(/__(.*?)__/g, '_$1_')
                    .trim();

                // Response දිග limit
                const MAX_LEN = 3000;
                const trimmedResponse = cleanResponse.length > MAX_LEN
                    ? cleanResponse.slice(0, MAX_LEN).trim() + '\n\n_... (දිගු නිසා කපා ඇත)_'
                    : cleanResponse;

                const text =
                    `*↳ ❝ [🤖 Gemini AI 🤖] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ ඔබේ ප්‍රශ්නය ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ _${cleanQuestion}_\n\n` +
                    `*⊹₊⟡⋆ ⋮ පිළිතුර ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `${trimmedResponse}\n\n` +
                    `*⊹₊⟡⋆ ⋮ Model ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ \`${model || 'gemini'}\`\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                // PERF: image නෑ — text only, instant delivery
                await socket.sendMessage(sender, {
                    text,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[gemini] error:', err?.message || err);
                await reply('*🍓 Gemini AI සමඟ සම්බන්ධ වීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
