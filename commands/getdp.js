/*
  Command: getdp, pfp
  Get profile picture of a user.
*/
module.exports = {
    name: 'getdp',
    aliases: ['pfp'],
    execute: async (ctx) => {
        const {
            socket,
            msg,
            sender,
            args,
            reply,
            arabianCtx,
        } = ctx;

        { // command body
            socket.sendMessage(sender, { react: { text: '📷', key: msg.key } }).catch(() => {});

            try {
                // FIX 1: target resolve order — mention > quoted reply > number arg > self
                const qCtx =
                    msg.message?.extendedTextMessage?.contextInfo ||
                    msg.message?.imageMessage?.contextInfo ||
                    msg.message?.videoMessage?.contextInfo ||
                    null;

                let target;

                if (qCtx?.mentionedJid?.[0]) {
                    // @mention
                    target = qCtx.mentionedJid[0];
                } else if (qCtx?.participant) {
                    // quoted message sender
                    target = qCtx.participant;
                } else if (args[0] && args[0].replace(/[^0-9]/g, '').length > 4) {
                    // FIX 2: number length check — empty/short strings prevent bad JIDs
                    target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                } else {
                    // self
                    target = sender;
                }

                // FIX 3: JID normalize — group participant JIDs sometimes have device suffix
                target = target.includes(':')
                    ? target.split(':')[0] + '@s.whatsapp.net'
                    : target;

                // FIX 4: try 'image' first, fallback to 'preview' (low-res)
                let dpUrl;
                try {
                    dpUrl = await socket.profilePictureUrl(target, 'image');
                } catch {
                    try {
                        dpUrl = await socket.profilePictureUrl(target, 'preview');
                    } catch {
                        return reply(
                            '*↳ ❝ [📷 Profile Picture] ¡! ❞*\n\n' +
                            '*⊹₊⟡⋆ ⋮ සටහන ᶻ 𝗓 𐰁 .ᐟ*\n' +
                            '➜ ❌ Profile picture ලබාගත නොහැකිය.\n' +
                            '➜ _Privacy settings නිසා hide කර ඇත._\n\n' +
                            '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*'
                        );
                    }
                }

                const targetNumber = target.split('@')[0];

                const caption =
                    `*↳ ❝ [📷 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗣𝗶𝗰𝘁𝘂𝗿𝗲 📷] ¡! ❞*\n\n` +
                    `*⊹₊⟡⋆ ⋮ පරිශීලකයා ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ 👤 @${targetNumber}\n\n` +
                    `*⊹₊⟡⋆ ⋮ සටහන ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ 📷 Profile picture සාර්ථකව ලබාගන්නා ලදී.\n\n` +
                    `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

                // FIX 5: contextInfo + mentions දාලා @ mention properly show වෙනවා
                await socket.sendMessage(sender, {
                    image: { url: dpUrl },
                    caption,
                    mentions: [target],
                    contextInfo: arabianCtx()
                }, { quoted: msg });

            } catch (err) {
                console.error('[getdp] error:', err?.message || err);
                await reply(
                    '*🍓 Profile picture ලබාගැනීමට අසමත් විය.*\n' +
                    '➜ කරුණාකර නැවත උත්සාහ කරන්න.'
                );
            }
        }
    }
};
