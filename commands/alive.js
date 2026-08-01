/*
  Command: alive
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'alive',
    aliases: [],
    execute: async (ctx) => {
        const {
            socket,
            number,
            sanitizedNumber,
            sessionConfig,
            recentCallers,
            msg,
            type,
            quoted,
            body,
            text,
            isCmd,
            sender,
            nowsender,
            senderNumber,
            developers,
            botNumber,
            isbot,
            isOwner,
            isAshuu,
            isGroup,
            parts,
            command,
            args,
            match,
            groupMetadata,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
            getUptime,
            ARABIAN_THUMB_G,
            arabianCtxGlobal,
            ARABIAN_TITLE,
            ARABIAN_SUB,
            arabianCtx,
            downloadQuotedMedia,
            sendReply,
            replyFq,
            config,
            akira,
            formatMessage,
            fetchJson,
            runtime,
            resize,
            capital,
            createSerial,
            deleteSession,
            loadUserConfig,
            updateUserConfig,
            uploadToCatbox,
            saveMediaToCatbox,
            saveSession,
            restoreSession,
            destroySocket,
            Session,
            mongoose,
            axios,
            yts,
            ytmp3,
            ytmp4,
            Jimp,
            moment,
            os,
            fecth,
            ffmpeg,
            crypto,
            path,
            fs,
            exec,
            activeSockets,
            socketCreationTime,
            loadAdmins,
            getSriLankaTimestamp,
            images,
            EmpirePair
        } = ctx;

        { // command body (own scope, so locals can shadow ctx names)
      // PERF: react is fire-and-forget (not awaited) so it can't block the reply.
      socket.sendMessage(sender, { react: { text: '🍓', key: msg.key } }).catch(() => {});

    const startTime = socketCreationTime.get(sanitizedNumber) || Date.now();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const title = '*↳ ❝ [🎀 𝗭𝗲𝘁𝗮 𝗚𝗶𝗿𝗹 𝗔𝗹𝗶𝘃𝗲 🎀] ¡! ❞*';
    const content = `*⊹₊⟡⋆ ⋮ Ａｂｏｕｔ ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ This is a lightweight, stable WhatsApp bot designed to run 24/7. It is allowing users and group admins to fine-tune the bot’s behavior.\n\n` +
                    `*⊹₊⟡⋆ ⋮ Ｄｅｐｌｏｙ ᶻ 𝗓 𐰁 .ᐟ*\n` +
                    `➜ *Website:* 𝗪𝗮𝗶𝘁 🫶🤍`;
    const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

    // PERF: plain text instead of image: {url} — no remote fetch + re-upload delay.
    await socket.sendMessage(sender, {
        text: `${title}\n\n${content}\n\n${footer}`,
        contextInfo: arabianCtx() 
    }, { quoted: msg });
        }
    }
};
