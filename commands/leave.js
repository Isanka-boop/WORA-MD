/*
  Command: leave
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'leave',
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
if (!isGroup) return reply('Groups only.');
      if (!isOwner && !isSessionOwner && !isDevUser) return reply('Only owner can make the bot leave.');
      try {
        await reply('👋 Goodbye! Leaving group...');
        await delay(1500);
        await socket.groupLeave(sender);
      } catch (e) { await reply(`leave failed: ${e.message}`); }
        }
    }
};
