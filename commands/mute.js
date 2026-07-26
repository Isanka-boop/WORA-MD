/*
  Command: mute
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'mute',
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
      const durStr = (args[0] || '').toLowerCase();
      const durMap = { '1h': 3600, '6h': 21600, '1d': 86400, '7d': 604800 };
      const secs   = durMap[durStr];
      if (!secs) return reply(`Usage: .mute <1h|6h|1d|7d>`);
      try {
        await socket.groupSettingUpdate(sender, 'announcement');
        await reply(`🔇 Group muted for *${durStr}*. Use *.unmute* to restore early.`);
        setTimeout(async () => {
          try { await socket.groupSettingUpdate(sender, 'not_announcement'); } catch (_) {}
        }, secs * 1000);
      } catch (e) { await reply(`Mute failed: ${e.message}`); }
        }
    }
};
