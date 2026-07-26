/*
  Command: mode, wtype
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'mode',
    aliases: ['wtype'],
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
if (!isOwner) return reply('Owner only.');
    if (!args[0]) return reply(`Usage: ${sessionConfig.PREFIX}mode <public/private>`);

    const newMode = args[0].toLowerCase();
    if (newMode !== 'public' && newMode !== 'private') {
        return reply('Please use "public" or "private"');
    }

    try {
        sessionConfig.MODE = newMode;
        await updateUserConfig(sanitizedNumber, sessionConfig);
    
        const currentData = activeSockets.get(sanitizedNumber);
        if (currentData) {
            currentData.config = sessionConfig;
            activeSockets.set(sanitizedNumber, currentData);
        }

        await socket.sendMessage(sender, { 
            react: { text: '⚙️', key: msg.key } 
        });

        await reply(`✅ Bot mode successfully changed to *${newMode}* mode.`);
    } catch (e) {
        console.error(e);
        await reply(`Error: ${e.message}`);
    }
        }
    }
};
