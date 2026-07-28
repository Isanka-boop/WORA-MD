/*
  Command: video, ytmp4, playvid
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'video',
    aliases: ['ytmp4', 'playvid'],
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
        const text = args.join(' ');
        if (!text) return reply("🎥 *Send me a video name or yt link !*");

        try { await socket.sendMessage(sender, { react: { text: '🔍', key: msg.key } }); } catch (_) {}
        // Search + API call + full video download below can take a good
        // few seconds — show "typing..." the whole time so it's clear the
        // bot is still working, not stuck.
        socket.sendPresenceUpdate('composing', sender).catch(() => {});
 
        const search = await yts(text);
        const video = search.videos[0]; 

        if (!video) return reply("❌ *I cant get video*");

        const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
        const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

        let caption = `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗩𝗶𝗱𝗲𝗼 🎀] ¡! ❞*\n\n` +
                        `🎬 *TITLE :* ${video.title}\n` +
                        `👤 *CHANNEL :* ${video.author.name}\n` +
                        `⏱️ *DURATION :* ${video.timestamp}\n` +
                        `📽️ *QUALITY :* 360p\n` +
                        `__________________________\n\n` +
                        `📅 *DATE :* ${slDate} | ⌚ *TIME :* ${slTimeNow}\n\n` +
                        `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

        try { await socket.sendMessage(sender, { react: { text: '📥', key: msg.key } }); } catch (_) {}

        const ytRes = await axios.get(`https://ytdl-new-dxz.vercel.app/api/ytmp4?url=${encodeURIComponent(video.url)}&quality=360`);
        
        const downloadUrl = ytRes.data.video_url || ytRes.data.download_url;

        if (!downloadUrl) {
            return reply("❌ *API error !*");
        }

        const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
        const videoBuffer = Buffer.from(response.data);

        await socket.sendMessage(sender, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: caption,
            fileName: `${video.title}.mp4`,
            jpegThumbnail: (await axios.get(video.thumbnail, { responseType: 'arraybuffer' })).data
        }, { quoted: msg });

        try { await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } }); } catch (_) {}

    } catch (e) {
        console.log("VIDEO CMD ERROR:", e);
        reply("❌ *ERROR try again later !*");
        try { await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } }); } catch (_) {}
    } finally {
        socket.sendPresenceUpdate('paused', sender).catch(() => {});
    }
        }
    }
};
