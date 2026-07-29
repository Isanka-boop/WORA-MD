/*
  Command: emoji
  Search emojis via https://emojidbapi.netlify.app/api/emojis?query=TEXT
*/
module.exports = {
    name: 'emoji',
    aliases: ['emojisearch', 'emojidb'],
    execute: async (ctx) => {
        const {
            socket,
            sanitizedNumber,
            msg,
            sender,
            text,
            args,
            reply,
            arabianCtx,
            fetchJson,
            axios
        } = ctx;

        { // command body
            socket.sendMessage(sender, { react: { text: '🦋', key: msg.key } }).catch(() => {});

            const query = (text || args?.join(' ') || '').trim();

            if (!query) {
                return reply(
                    `*⊹₊⟡⋆ ⋮ 𝗘𝗺𝗼𝗷𝗶 𝗦𝗲𝗮𝗿𝗰𝗵 𐰁 .ᐟ*\n\n` +
                    `➜ *Usage:* .emoji <text>\n` +
                    `➜ *Example:* .emoji heart\n\n` +
                    `*⋆.˚🦋༘⋆ Supports -*\n` +
                    `##. heart\n##. smile\n##. cat`
                );
            }

            const apiUrl = `https://emojidbapi.netlify.app/api/emojis?query=${encodeURIComponent(query)}`;

            let data;
            try {
                if (typeof fetchJson === 'function') {
                    data = await fetchJson(apiUrl);
                } else {
                    const res = await axios.get(apiUrl, { timeout: 15000 });
                    data = res.data;
                }
            } catch (err) {
                return reply(
                    `*✗ Emoji search failed*\n➜ ${err?.message || 'API unreachable, try again later.'}`
                );
            }

            // Normalize possible response shapes
            let results =
                data?.results ||
                data?.emojis ||
                data?.data ||
                (Array.isArray(data) ? data : null);

            if (!results || !Array.isArray(results) || results.length === 0) {
                return reply(
                    `*✗ No emojis found for* "${query}"\n➜ Try a different keyword like heart, smile, cat.`
                );
            }

            // Detect whether results are image URLs or raw emoji/unicode strings
            const isImageResult = (item) => {
                const val = typeof item === 'string' ? item : (item?.url || item?.image || item?.src || '');
                return typeof val === 'string' && /^https?:\/\/.+\.(png|jpe?g|gif|webp)/i.test(val);
            };

            const limited = results.slice(0, 10);

            if (isImageResult(limited[0])) {
                // Send as images (max 5 to avoid spam/rate issues)
                const imagesToSend = limited.slice(0, 5);
                for (const item of imagesToSend) {
                    const url = typeof item === 'string' ? item : (item?.url || item?.image || item?.src);
                    if (!url) continue;
                    try {
                        await socket.sendMessage(
                            sender,
                            {
                                image: { url },
                                caption: `*⊹₊⟡⋆ ⋮ Ｅｍｏｊｉ Ｒｅｓｕｌｔ ᶻ 𝗓 𐰁 .ᐟ*\n➜ *Query:* ${query}`,
                                contextInfo: arabianCtx()
                            },
                            { quoted: msg }
                        );
                    } catch (e) {
                        // skip broken image, continue with next
                    }
                }
            } else {
                // Treat as text/unicode emoji list
                const emojiList = limited
                    .map((item) => (typeof item === 'string' ? item : item?.emoji || item?.char || item?.name || ''))
                    .filter(Boolean)
                    .join('  ');

                await socket.sendMessage(
                    sender,
                    {
                        text:
                            `*⊹₊⟡⋆ ⋮ Ｅｍｏｊｉ Ｓｅａｒｃｈ ᶻ 𝗓 𐰁 .ᐟ*\n\n` +
                            `➜ *Query:* ${query}\n` +
                            `➜ *Results:*\n${emojiList}\n\n` +
                            `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`,
                        contextInfo: arabianCtx()
                    },
                    { quoted: msg }
                );
            }
        }
    }
};
