/*
  Command: text2img
  Generates an AI image from a text prompt using whiteshadow-x-api.
*/
module.exports = {
    name: 'text2img',
    aliases: ['imagine', 'ai2img', 'generate'],
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
            socket.sendMessage(sender, { react: { text: '🎨', key: msg.key } }).catch(() => {});

            const prompt = (text || '').trim();

            if (!prompt) {
                return reply(
                    '*↳ ❝ [🎨 AI රූප උත්පාදකය] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ භාවිතය ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ *.text2img <විස්තරය>*\n\n' +
                    '*⊹₊⟡⋆ ⋮ උදාහරණ ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    '➜ .text2img a beautiful sunset over the ocean\n' +
                    '➜ .text2img a cute cat with sunglasses\n' +
                    '➜ .text2img futuristic city at night\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                );
            }

            // Processing message — image generate වෙන්න time යනවා නිසා
            await socket.sendMessage(sender, {
                text:
                    '*↳ ❝ [🎨 AI රූප උත්පාදකය] ¡! ❞*\n\n' +
                    '*⊹₊⟡⋆ ⋮ සකසමින් ᶻ 𝗓 𐰁 .ᐟ*\n' +
                    `➜ 🖌️ "${prompt}"\n\n` +
                    '➜ ⏳ කරුණාකර රැඳී සිටින්න...\n\n' +
                    '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*',
                contextInfo: arabianCtx()
            }, { quoted: msg });

            try {
                const apiToken = 'aWK0z4';
                const endpoint = `https://whiteshadow-x-api.onrender.com/api/ai/text2img?apitoken=${apiToken}&prompt=${encodeURIComponent(prompt)}`;

                const { data } = await axios.get(endpoint, { timeout: 60000 });

                if (!data || data.success !== true || !data.image) {
                    return reply('*🍓 රූපය සෑදීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
                }

                const caption =
                    `*↳ ❝ [🎨 AI රූප උත්පාදකය 🎨] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ Prompt ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ _${data.prompt || prompt}_\n\n` +
                    `*⊹₊⟡⋆ ⋮ Job ID ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ \`${data.jobId || 'N/A'}\`\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                await socket.sendMessage(sender, {
                    image: { url: data.image },
                    caption,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[text2img] error:', err?.message || err);
                await reply('*🍓 AI රූපය ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
