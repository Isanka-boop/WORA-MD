/*
  Command: quote
  Fetches a random quote from the Hashu Apis quote endpoint.
*/
module.exports = {
    name: 'quote',
    aliases: ['quotes'],
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
        // PERF: react is fire-and-forget (not awaited) so it can't block the reply.
        socket.sendMessage(sender, { react: { text: '💭', key: msg.key } }).catch(() => {});

        const apiUrl = 'https://hashu-apis-official.onrender.com/api/quote?apiKey=hashu_f734afee39f42a269369335194b5aa8e';
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

        if (!data || data.success !== true || !data.results || !data.results.text) {
          return await reply('*Failed to fetch a quote right now. Please try again later!*');
        }

        const { text: quoteText, author } = data.results;

        const title = '*↳ ❝ [🎀 𝗤𝘂𝗼𝘁𝗲 𝗢𝗳 𝗧𝗵𝗲 𝗠𝗼𝗺𝗲𝗻𝘁 🎀] ¡! ❞*';
        const content = `*⊹₊⟡⋆ ⋮ Ｑｕｏｔｅ ᶻ 𝗓 𐰁 .ᐟ*\n➜ "${quoteText}"\n\n*⊹₊⟡⋆ ⋮ Ａｕｔｈｏｒ ᶻ 𝗓 𐰁 .ᐟ*\n➜ ${author || 'Unknown'}`;
        const footer = '> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*';

        await socket.sendMessage(sender, {
            text: `${title}\n\n${content}\n\n${footer}`,
            contextInfo: arabianCtx()
        }, { quoted: msg });
      } catch (error) {
        console.error('Error fetching quote:', error);
        await reply('*An error occurred while fetching the quote!*');
      }
        }
    }
};
