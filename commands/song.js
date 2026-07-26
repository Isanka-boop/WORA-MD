/*
  Command: song, ytmp3
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'song',
    aliases: ['ytmp3'],
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
        if (!query) return reply("🎵 *Plz Send Me A Song Name !*");

        try { await socket.sendMessage(sender, { react: { text: '🔎', key: msg.key } }); } catch (_) {}

        const search = await yts(query);
        const video = search.videos[0]; 

        if (!video) return reply("❌ *I Cant Find It !*");

        const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
        const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

        const caption = `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗩𝗶𝗱𝗲𝗼 🎀] ¡! ❞*\n\n` +
                        `> *\`🎵 𝚃𝙸𝚃𝙻𝙴 :\`* ${video.title}\n` +
                        `> *\`👤 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 :\`* ${video.author.name}\n` +
                        `> *\`⏱️ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽 :\`* ${video.timestamp}\n` +
                        `> *\`👀 𝚅𝙸𝙴𝚆𝚂 :\`* ${video.views.toLocaleString()}\n` +
                        `> *\`📅 𝙳𝙰𝚃𝙴 :\`* ${slDate}\n` +
                        `> *\`⌚ 𝚃𝙸𝙼𝙴 :\`* ${slTimeNow}\n\n` +
                        `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

        await socket.sendMessage(sender, {
            image: { url: video.thumbnail },
            caption: caption,
            contextInfo: arabianCtx()
        }, { quoted: msg });

        const ytRes = await axios.get(`https://ytdl-new-dxz.vercel.app/api/ytmp3?url=${encodeURIComponent(video.url)}`);
        const downloadUrl = ytRes.data.download_url || ytRes.data.result || ytRes.data.url;

        if (!downloadUrl) return reply("❌ *I cant get MP3 !*");

        await socket.sendMessage(sender, {
            audio: { url: downloadUrl },
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: msg });

        try { await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } }); } catch (_) {}

    } catch (e) {
        console.log("SONG CMD ERROR:", e);
        reply("❌ *Error: " + e.message + "*");
    }
        }
    }
};
