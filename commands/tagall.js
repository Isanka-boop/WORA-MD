/*
  Command: tagall
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'tagall',
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
if (!isGroup) return reply('This command only works in groups.');
      try {
        const gm       = await socket.groupMetadata(sender);
        const ps       = gm.participants || [];
        const tm       = args.join(' ').trim() || '*Attention everyone!*';
        const mentions = ps.map(p => p.id);
        let text = `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗧𝗮𝗴𝗮𝗹𝗹 🎀] ¡! ❞*\n\n> *\`🗣️ :\`* ${tm}\n\n`;
        for (const p of ps) text += `₊❏❜ ⋮ @${p.id.split('@')[0]}\n`;
        text += `\n> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;
        await socket.sendMessage(sender, { text, mentions }, { quoted: msg });
      } catch (e) { await reply(`tagall failed: ${e.message}`); }
        }
    }
};
