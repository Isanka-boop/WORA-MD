/*
  Command: hentai
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'hentai',
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
try {
    await socket.sendMessage(sender, {
      react: { text: '🔞', key: msg.key }
    });
  } catch (_) {}

  try {
    const response = await axios.get('https://www.movanest.xyz/v2/hentai?query=random');
    const data = response.data;

    if (data && data.status && data.result && data.result.length > 0) {
      const results = data.result;
      const randomVideo = results[Math.floor(Math.random() * results.length)];
      
      const videoUrl = randomVideo.video_1 || randomVideo.video_2;
      if (!videoUrl) return reply("No Video Available !");

      await socket.sendMessage(
        sender, 
        {
          video: { url: videoUrl },
          caption:
`*↳ ❝ [🔞 𝗛𝗲𝗻𝘁𝗮𝗶 𝗥𝗮𝗻𝗱𝗼𝗺 🔞] ¡! ❞*

*₊❏❜ ⋮ 🎬 Title:* ${randomVideo.title}
*₊❏❜ ⋮ 📁 Category:* ${randomVideo.category}
*₊❏❜ ⋮ 👁️ Views:* ${randomVideo.views_count}

> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`
        }, 
        { quoted: msg }
      );
    } else {
      await reply("Server Error ! pls try again later .");
    }

  } catch (error) {
    console.error(error);
    await reply(`Error! API:\n${error.message}`);
  }
        }
    }
};
