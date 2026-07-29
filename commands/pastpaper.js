/*
  Command: pastpaper
  Sri Lankan past-paper search, backed by:
    https://wikipaperskcey.netlify.app/api/pastpapers?action=search&query=<QUERY>
    https://wikipaperskcey.netlify.app/api/pastpapers?action=downloads&url=<PAGE_URL>

  Usage:
    .pastpaper <subject/grade/keyword>   → search, lists matching pages
    .pastpaper dl <page url>             → get direct download links for one result

  NOTE: the API's exact JSON field names couldn't be confirmed ahead of time
  (only the site's homepage was reachable while writing this, not the live
  API response), so this reads several likely field-name variants
  (results/data/items, title/name, url/link, etc.) with fallbacks. If the
  real response uses different keys, results may show up blank — send a
  sample JSON response and this can be tightened up.
*/
module.exports = {
    name: 'pastpaper',
    aliases: ['pastpapers', 'paper'],
    execute: async (ctx) => {
        const { axios, args, match, reply, sender, socket, msg } = ctx;
        const BASE = 'https://wikipaperskcey.netlify.app/api/pastpapers';

        // Pull the first array-looking value out of a few likely response shapes.
        const pickArray = (data, keys) => {
            for (const k of keys) {
                if (Array.isArray(data?.[k])) return data[k];
            }
            return Array.isArray(data) ? data : [];
        };

        try {
            const sub = (args[0] || '').toLowerCase();

            // .pastpaper dl <page url>
            if (sub === 'dl' || sub === 'download') {
                const pageUrl = args.slice(1).join(' ').trim();
                if (!pageUrl) {
                    return reply(
                        '❌ *Give the page URL to fetch downloads for.*\n' +
                        'Example: `pastpaper dl https://pastpapers.wiki/...`\n\n' +
                        '_Tip: run `pastpaper <subject/grade>` first to find a page URL._'
                    );
                }

                socket.sendMessage(sender, { react: { text: '📥', key: msg.key } }).catch(() => {});

                const { data } = await axios.get(BASE, {
                    params: { action: 'downloads', url: pageUrl },
                    timeout: 20000
                });

                const links = pickArray(data, ['downloads', 'links', 'files', 'results', 'data']);
                if (!links.length) {
                    return reply('❌ *No download links found for that page.* Double-check the URL and try again.');
                }

                let out = `📥 *Download Links*\n\n`;
                links.slice(0, 15).forEach((item, i) => {
                    const label = (item && (item.name || item.title || item.label)) || `Link ${i + 1}`;
                    const link = (item && (item.url || item.link || item.href)) || (typeof item === 'string' ? item : '');
                    out += `*${i + 1}.* ${label}\n${link}\n\n`;
                });

                return reply(out.trim());
            }

            // .pastpaper <query>  → search
            const query = (match || args.join(' ')).trim();
            if (!query) {
                return reply(
                    `📚 *Past Paper Search*\n\n` +
                    `*Usage:*\n` +
                    `• pastpaper <subject / grade / keyword>\n` +
                    `• pastpaper dl <page url>  _(get direct download links from a result)_\n\n` +
                    `*Example:*\n` +
                    `• pastpaper grade 10 chemistry`
                );
            }

            socket.sendMessage(sender, { react: { text: '🔎', key: msg.key } }).catch(() => {});

            const { data } = await axios.get(BASE, {
                params: { action: 'search', query },
                timeout: 20000
            });

            const results = pickArray(data, ['results', 'data', 'items']);
            if (!results.length) {
                return reply(`❌ *No past papers found for* "${query}". Try a different subject/grade/keyword.`);
            }

            let out = `📚 *Past Paper Results for "${query}"*\n\n`;
            results.slice(0, 10).forEach((item, i) => {
                const title = (item && (item.title || item.name || item.subject)) || `Result ${i + 1}`;
                const url = (item && (item.url || item.link || item.href)) || '';
                out += `*${i + 1}.* ${title}\n${url}\n\n`;
            });
            out += `_Get download links:_ \`pastpaper dl <url from above>\``;

            reply(out.trim());

        } catch (e) {
            console.log('PASTPAPER CMD ERROR:', e.message);
            reply('❌ *Failed to fetch past papers.* The service might be down, slow, or the request timed out. Try again shortly.');
        }
    }
};
