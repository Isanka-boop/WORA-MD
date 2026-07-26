/*
  Command: vv
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'vv',
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
const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted) return reply(`Reply to a view-once message with *.vv*`);
      try {
        const media = await downloadQuotedMedia(quoted);
        if (!media?.buffer) return reply('Could not download that media.');
        const qt = MEDIA_TYPES.find(t => quoted[t]);
        
        if (qt === 'imageMessage') {
          await socket.sendMessage(sender, { image: media.buffer, caption: 'View-once unlocked 👀', contextInfo: arabianCtx() }, { quoted: msg });
        } else if (qt === 'videoMessage') {
          await socket.sendMessage(sender, { video: media.buffer, caption: 'View-once unlocked 👀', contextInfo: arabianCtx() }, { quoted: msg });
        } else if (qt === 'audioMessage') {
          await socket.sendMessage(sender, { audio: media.buffer, mimetype: media.mime || 'audio/mpeg', ptt: quoted.audioMessage?.ptt, contextInfo: arabianCtx() }, { quoted: msg });
        } else if (qt === 'stickerMessage') {
          await socket.sendMessage(sender, { sticker: media.buffer, contextInfo: arabianCtx() }, { quoted: msg });
        } else {
          await socket.sendMessage(sender, { document: media.buffer, mimetype: media.mime || 'application/octet-stream', fileName: media.fileName || 'file', contextInfo: arabianCtx() }, { quoted: msg });
        }
        
        try { await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } }); } catch (_) {}
      } catch (e) { await reply(`Failed: ${e.message}`); }
        }
    }
};
