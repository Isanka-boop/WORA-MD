/*
  Command: fb, facebook
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'fb',
    aliases: ['facebook'],
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
        const query = args.join(' ');
        if (!query) return reply("🔗 *Send me a video link !*");
        
        if (!query.includes('facebook.com') && !query.includes('fb.watch')) {
            return reply("❌ *This Not Valid Facebook Link !*");
        }

        try { await socket.sendMessage(sender, { react: { text: '📥', key: msg.key } }); } catch (_) {}

        const fbRes = await axios.get(`https://www.movanest.xyz/v2/fbdown?url=${encodeURIComponent(query)}`);
        
        if (!fbRes.data.status || !fbRes.data.results.length) {
            return reply("❌ *I cant get video link !*");
        }

        const videoData = fbRes.data.results[0];
        const videoUrl = videoData.hdQualityLink || videoData.normalQualityLink; 
        const quality = videoData.hdQualityLink ? 'High Definition (HD)' : 'Standard (SD)';

        const response = await axios.get(videoUrl, { 
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        const videoBuffer = Buffer.from(response.data);
        const fileSizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);

        const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
        const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

        const caption = `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 🎀] ¡! ❞*\n\n` +
                        `🎬 *TITLE :* ${videoData.title !== "No video title" ? videoData.title : 'Facebook Video'}\n` +
                        `⏱️ *DURATION :* ${videoData.duration}\n` +
                        `📺 *QUALITY :* ${quality}\n` +
                        `⚖️ *SIZE :* ${fileSizeMB} MB\n` +
                        `__________________________\n\n` +
                        `📅 *DATE :* ${slDate} | ⌚ *TIME :* ${slTimeNow}\n\n` +
                        `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

        await socket.sendMessage(sender, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: caption,
            fileName: `fb_video_${slTimeNow}.mp4`
        }, { quoted: msg });

        try { await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } }); } catch (_) {}

    } catch (e) {
        console.log("FB CMD ERROR:", e);
        reply("❌ *API error !*");
        try { await socket.sendMessage(sender, { react: { text: '❌', key: msg.key } }); } catch (_) {}
    }
        }
    }
};
