/*
  Command: passwordgen
  Generates a random password using hashu-apis.
*/
module.exports = {
    name: 'passwordgen',
    aliases: ['genpass', 'password', 'pass'],
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
            socket.sendMessage(sender, { react: { text: '🔐', key: msg.key } }).catch(() => {});

            try {
                const apiKey = 'hashu_f734afee39f42a269369335194b5aa8e';

                // User විසින් length එකක් දුන්නොත් use කරනවා (e.g. .passwordgen 16)
                const requestedLength = parseInt((text || '').trim());
                const lengthParam = !isNaN(requestedLength) && requestedLength > 0
                    ? `&length=${requestedLength}`
                    : '';

                const endpoint = `https://hashu-apis-official.onrender.com/api/passwordgen?apiKey=${apiKey}${lengthParam}`;

                const { data } = await axios.get(endpoint, { timeout: 15000 });

                if (!data || data.success !== true || !data.results?.password) {
                    return reply('*🍓 මුරපදය සෑදීමට නොහැකි විය.*');
                }

                const { password, length } = data.results;

                // Password strength indicator
                const hasUpper = /[A-Z]/.test(password);
                const hasLower = /[a-z]/.test(password);
                const hasNumber = /[0-9]/.test(password);
                const hasSymbol = /[^A-Za-z0-9]/.test(password);

                const strengthScore = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
                const strengthLabel =
                    strengthScore === 4 ? '🟢 ඉතා ශක්තිමත්' :
                    strengthScore === 3 ? '🟡 ශක්තිමත්' :
                    strengthScore === 2 ? '🟠 මධ්‍යම' :
                                         '🔴 දුර්වල';

                const title = '*↳ ❝ [🔐 මුරපද උත්පාදකය 🔐] ¡! ❞*';
                const content =
                    `*⊹₊⟡⋆ ⋮ ජනනය කළ මුරපදය ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ \`${password}\`\n\n` +
                    `*⊹₊⟡⋆ ⋮ විස්තර ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ *අක්ෂර ගණන:* ${length}\n` +
                    `➜ *ශක්තිය:* ${strengthLabel}\n\n` +
                    `*⊹₊⟡⋆ ⋮ ඇතුළත් දේ ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ ${hasUpper  ? '✅' : '❌'} ලොකු අකුරු (A-Z)\n` +
                    `➜ ${hasLower  ? '✅' : '❌'} කුඩා අකුරු (a-z)\n` +
                    `➜ ${hasNumber ? '✅' : '❌'} අංක (0-9)\n` +
                    `➜ ${hasSymbol ? '✅' : '❌'} විශේෂ සංකේත (!@#...)\n`;
                const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

                await socket.sendMessage(sender, {
                    text: `${title}\n\n${content}\n${footer}`,
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[passwordgen] error:', err?.message || err);
                await reply('*🍓 මුරපදය ලබාගැනීමට අසමත් විය. කරුණාකර නැවත උත්සාහ කරන්න.*');
            }
        }
    }
};
