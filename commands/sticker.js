/*
  Command: sticker, stiker, s
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'sticker',
    aliases: ['stiker', 's'],
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
try { 
        await socket.sendMessage(sender, { react: { text: '🎨', key: msg.key } }); 
      } catch (_) {}

      const qCtx = msg.message?.extendedTextMessage?.contextInfo;
      const quoted = qCtx?.quotedMessage;
      
      if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
        return reply(`Reply to an image or short video with *.sticker*`);
      }

      try {
        const { default: WASticker, StickerTypes } = require('wa-sticker-formatter');
        
        const media = await downloadQuotedMedia(quoted);
        if (!media?.buffer) return reply('Could not download media.');

        const sticker = new WASticker(media.buffer, { 
          pack: botName, 
          author: 'chamodz', 
          type: StickerTypes.FULL, 
          categories: ['🤩'], 
          id: '12345', 
          quality: 50 
        });

        const buffer = await sticker.toBuffer();
        await socket.sendMessage(sender, { sticker: buffer }, { quoted: msg });

      } catch (e) { 
        console.error(e);
        await reply(`Sticker creation failed: ${e.message}`); 
      }
        }
    }
};
