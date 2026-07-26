/*
  Command: styletext, fancy, fancytext
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'styletext',
    aliases: ['fancy', 'fancytext'],
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
const q = msg.message?.conversation || 
              msg.message?.extendedTextMessage?.text || 
              msg.message?.imageMessage?.caption || '';

    const textToStyle = q.replace(/^[^\s]+\s+/, '').trim();

    if (!textToStyle || textToStyle === '') {
        return await socket.sendMessage(sender, { 
            text: '*❓ Text Is Missing.* \n📋 Ex: .styletext Hello World' 
        });
    }

    try {
        await socket.sendMessage(sender, { react: { text: '✨', key: msg.key } });

        const response = await axios.get(`https://www.movanest.xyz/v2/fancytext?word=${encodeURIComponent(textToStyle)}`);
        
        if (!response.data.status) {
            throw new Error('API processing failed');
        }

        const results = response.data.results;
        
        let styledMsg = `*✨ FANCY TEXT STYLES *\n\n`;
        styledMsg += `*Original:* ${textToStyle}\n\n`;
        styledMsg += `*┏━━━━━°⌜ \`赤い糸\` ⌟°━━━━━┓*\n`;

        results.slice(0, 25).forEach((styledText, index) => {
            styledMsg += `*┃ ${index + 1}.* ${styledText}\n`;
        });
        
        styledMsg += `*┗━━━━━°⌜ \`赤い糸\` ⌟°━━━━━┛*\n\n`;
        styledMsg += `> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`;

        await socket.sendMessage(sender, { 
			image: { url: akira }, 
            text: styledMsg
        }, { quoted: msg });

        await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });

    } catch (err) {
        console.error('StyleText API Error:', err);
        await socket.sendMessage(sender, { 
            text: `*❌ Known Error Try Again*` 
        });
    }
        }
    }
};
