/*
  Command: wallpaper
  Fetches wallpapers from hashu-apis and sends them to the chat.
*/
module.exports = {
    name: 'wallpaper',
    aliases: ['wall', 'walls'],
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
            socket.sendMessage(sender, { react: { text: '🖼️', key: msg.key } }).catch(() => {});

            const query = (text || '').trim();

            if (!query) {
                return reply('*🍓 Usage:* .wallpaper <search term>\n*Example:* .wallpaper nature');
            }

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';
                const endpoint = `https://hashu-apis-official.onrender.com/api/wallpaper?apiKey=${apiKey}&q=${encodeURIComponent(query)}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !Array.isArray(data.results) || data.results.length === 0) {
                    return reply('*🍓 No wallpapers found for that search.*');
                }

                // Limit how many we send so we don't spam the chat / hit rate limits.
                const MAX_SEND = 5;
                const items = data.results.slice(0, MAX_SEND);

                for (const item of items) {
                    await socket.sendMessage(sender, {
                        image: { url: item.full_image },
                        caption: `*↳ ❝ 🎀 𝗪𝗮𝗹𝗹𝗽𝗮𝗽𝗲𝗿 🎀 ¡! ❞*\n\n` +
                                 `*⊹₊⟡⋆ ⋮ Resolution:* ${item.resolution}\n` +
                                 `*⊹₊⟡⋆ ⋮ Index:* ${item.index}\n\n` +
                                 `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`,
                        contextInfo: arabianCtx()
                    }, { quoted: msg });
                }
            } catch (err) {
                console.error('[wallpaper] error:', err?.message || err);
                await reply('*🍓 Failed to fetch wallpapers. Try again later.*');
            }
        }
    }
};
