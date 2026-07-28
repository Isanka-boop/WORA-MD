/*
  Command: sinhalasub
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'sinhalasub',
    aliases: ['movie'],
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
        const q = text || args?.join(' ');

        if (!q) {
          return await reply("*Please provide a search query! (e.g., Deadpool)*");
        }

        // NOTE: sinhalaSub() must be required at the top of your commands loader
        // e.g. const { sinhalaSub } = require('../lib/sinhalasub');
        const sinhalasubInstance = await sinhalaSub();
        const searchResults = await sinhalasubInstance.search(q);
        const limitedResults = searchResults.result.slice(0, 10);

        if (!limitedResults.length) {
          return await reply("No results found for: " + q);
        }

        let responseText = `📽️ *Search Results for* "${q}":\n\n`;
        limitedResults.forEach((result, index) => {
          responseText += `*${index + 1}.* ${result.title}\n🔗 Link: ${result.link}\n\n`;
        });

        const sentMessage = await socket.sendMessage(sender, { text: responseText }, { quoted: msg });
        const sentMessageId = sentMessage.key.id;

        socket.ev.on("messages.upsert", async event => {
          const newMessage = event.messages[0];
          if (!newMessage.message) return;

          const userMessage = newMessage.message.conversation || newMessage.message.extendedTextMessage?.text;
          const isReplyToSearch = newMessage.message.extendedTextMessage && newMessage.message.extendedTextMessage.contextInfo?.stanzaId === sentMessageId;

          if (isReplyToSearch) {
            const selectedNumber = parseInt(userMessage.trim());
            if (!isNaN(selectedNumber) && selectedNumber > 0 && selectedNumber <= limitedResults.length) {
              const selectedMovie = limitedResults[selectedNumber - 1];
              const apiUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${encodeURIComponent(selectedMovie.link)}`;

              try {
                const movieDetails = await axios.get(apiUrl);
                const downloadLinks = movieDetails.data.result.dl_links || [];

                if (!downloadLinks.length) {
                  return await reply("No PixelDrain links found.");
                }

                let downloadText = `🎥 *${movieDetails.data.result.title}*\n\n*Available PixelDrain Download Links:*\n`;
                downloadLinks.forEach((link, index) => {
                  downloadText += `*${index + 1}.* ${link.quality} - ${link.size}\n🔗 Link: ${link.link}\n\n`;
                });

                const downloadMessage = await socket.sendMessage(sender, { text: downloadText }, { quoted: newMessage });
                const downloadMessageId = downloadMessage.key.id;

                socket.ev.on('messages.upsert', async event => {
                  const downloadReply = event.messages[0];
                  if (!downloadReply.message) return;

                  const downloadReplyText = downloadReply.message.conversation || downloadReply.message.extendedTextMessage?.text;
                  const isReplyToDownload = downloadReply.message.extendedTextMessage && downloadReply.message.extendedTextMessage.contextInfo?.stanzaId === downloadMessageId;

                  if (isReplyToDownload) {
                    const downloadNumber = parseInt(downloadReplyText.trim());
                    if (!isNaN(downloadNumber) && downloadNumber > 0 && downloadNumber <= downloadLinks.length) {
                      const selectedLink = downloadLinks[downloadNumber - 1];
                      const fileId = selectedLink.link.split('/').pop();
                      const fileUrl = `https://pixeldrain.com/api/file/${fileId}`;

                      await socket.sendMessage(sender, { react: { text: '⬇️', key: msg.key } });
                      await socket.sendMessage(sender, {
                        document: { url: fileUrl },
                        mimetype: "video/mp4",
                        fileName: `${movieDetails.data.result.title} - ${selectedLink.quality}.mp4`,
                        caption: `${movieDetails.data.result.title}\nQuality: ${selectedLink.quality}\nPowered by SinhalaSub`,
                        contextInfo: {
                          mentionedJid: [],
                          externalAdReply: {
                            title: movieDetails.data.result.title,
                            body: "Download powered by SinhalaSub",
                            mediaType: 1,
                            sourceUrl: selectedMovie.link,
                            thumbnailUrl: movieDetails.data.result.image
                          }
                        }
                      }, { quoted: downloadReply });

                      await socket.sendMessage(sender, { react: { text: '✅', key: msg.key } });
                    } else {
                      await reply("Invalid selection. Please reply with a valid number.");
                    }
                  }
                });
              } catch (error) {
                console.error("Error fetching movie details:", error);
                await reply("An error occurred while fetching movie details. Please try again.");
              }
            } else {
              await reply("Invalid selection. Please reply with a valid number.");
            }
          }
        });
      } catch (error) {
        console.error("Error during search:", error);
        await reply("*An error occurred while searching!*");
      }
        }
    }
};
