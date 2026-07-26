/*
  Command: menu, list, panel
  Auto-extracted from the original pair.js command switch.
*/
module.exports = {
    name: 'menu',
    aliases: ['list', 'panel'],
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
try { await socket.sendMessage(sender, { react: { text: '🎀', key: msg.key } }); } catch (_) {}
      
      const start = Date.now();
      const ms    = Date.now() - start;
      const pushname = msg.pushName || 'User';
      const readMore = String.fromCharCode(8206).repeat(4000);
      

      const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
      const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

      await socket.sendMessage(sender, {
        image: { url: akira },
        caption: `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗠𝗲𝗻𝘂 🎀] ¡! ❞*

┏━━━━━°⌜ \`赤い糸\` ⌟°━━━━━┓
┃👤 *𝚄𝚂𝙴𝚁* : ${pushname}
┃📦 *𝚅𝙴𝚁𝚂𝙸𝙾𝙽* : V1
┃📅 *𝙳𝙰𝚃𝙴* : ${slDate}
┃⌚ *𝚃𝙸𝙼𝙴* : ${slTimeNow}
┗━━━━━°⌜ \`赤い糸\` ⌟°━━━━━┛

╭─⊹₊⟡⋆『 \`𝐌𝐚𝐢𝐧 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •menu ➜ ɢᴇᴛ ᴄᴍᴅ ʟɪꜱᴛ
│₊❏❜ ⋮ •system ➜ ɢᴇᴛ ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ
│₊❏❜ ⋮ •ping ➜ ɢᴇᴛ ʙᴏᴛ ꜱᴘᴇᴇᴅ
│₊❏❜ ⋮ •alive ➜ ᴄʜᴇᴄᴋ ʙᴏᴛ ᴀʟɪᴠᴇ
│₊❏❜ ⋮ •owner ➜ ɢᴇᴛ ᴏᴡɴᴇʀ ɪɴꜰᴏ
╰──────────────────<𝟑
╭─⊹₊⟡⋆『 \`𝐃𝐰𝐧 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •song ➜ ᴅᴏᴡɴʟᴏʀᴅ ꜱᴏɴɢ
│₊❏❜ ⋮ •video ➜ ᴅᴏᴡɴʟᴏʀᴅ ᴠɪᴅᴇᴏ
│₊❏❜ ⋮ •fb ➜ ᴅᴏᴡɴʟᴏʀᴅ ꜰʙ ᴠɪᴅᴇᴏ
│₊❏❜ ⋮ •tt ➜ ᴅᴏᴡɴʟᴏʀᴅ ᴛᴛ ᴠɪᴅᴇᴏ
╰──────────────────<𝟑
╭─⊹₊⟡⋆『 \`𝐓𝐨𝐨𝐥 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •vv ➜ ᴅᴇᴄʀʏᴘᴛ ᴏɴᴇ ᴛɪᴍᴇ ꜰɪʟᴇ
│₊❏❜ ⋮ •sticker ➜ ᴄᴏɴᴠᴇᴛʀ ᴛᴏ ꜱᴛᴋ
│₊❏❜ ⋮ •fancy ➜ ᴄᴏɴᴠᴇᴛ ᴛᴏ ꜰᴀɴᴄʏ ᴛᴇxᴛ
│₊❏❜ ⋮ •getdp ➜ ɢᴇᴛ ᴡʜ ᴘʀᴏꜰɪʟᴇ 4ᴛᴏ
│₊❏❜ ⋮ •npm ➜ ꜱᴇᴀʀᴄʜ ɴᴘᴍ ᴘᴋɢꜱ
│₊❏❜ ⋮ •img ➜ ꜱᴇᴀʀᴄʜ ɪᴍɢꜱ
│₊❏❜ ⋮ •mode ➜ ᴄʜᴀɴɢᴇ ʙᴏᴛ ᴍᴏᴅᴇ
╰──────────────────<𝟑
╭─⊹₊⟡⋆『 \`𝐆𝐫𝐨𝐮𝐩 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •tagall ➜ ᴛᴀɢᴀʟʟ ᴍᴇᴍʙᴇʀꜱ
│₊❏❜ ⋮ •hidetag ➜ ᴛᴀɢᴀʟʟ ᴍᴇᴍ ꜱɪʟᴇɴᴛʟʏ
│₊❏❜ ⋮ •add ➜ ᴀᴅᴅ ᴍᴇᴍʙᴇʀ
│₊❏❜ ⋮ •kick ➜ ᴋɪᴄᴋ ᴍᴇᴍʙᴇʀ
│₊❏❜ ⋮ •tagadmin ➜ ᴛᴀɢ ᴀʟʟ ᴀᴅᴍɪɴꜱ
│₊❏❜ ⋮ •promote ➜ ᴍᴀᴋᴇ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴ
│₊❏❜ ⋮ •demote ➜ ᴅɪꜱᴍɪꜱꜱ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴ
│₊❏❜ ⋮ •lockgroup ➜ ʟᴏᴄᴋ ᴛʜᴇ ɢʀᴏᴜᴘ
│₊❏❜ ⋮ •unlockgroup ➜ ᴜɴʟᴏᴄᴋ ᴛʜᴇ ɢʀᴏᴜᴘ
│₊❏❜ ⋮ •mute ➜ ᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ
│₊❏❜ ⋮ •unmute ➜ ᴜɴᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ
│₊❏❜ ⋮ •setname ➜ ꜱᴇᴛ ɢʀᴏᴜᴘ ɴᴀᴍᴇ
│₊❏❜ ⋮ •setdesc ➜ ꜱᴇᴛ ɢʀᴏᴜᴘ ᴅᴇꜱᴄ
│₊❏❜ ⋮ •seticon ➜ ꜱᴇᴛ ɢʀᴏᴜᴘ ɪᴄᴏɴ
│₊❏❜ ⋮ •linkgroup ➜ ɢᴇᴛ ɢʀᴏᴜᴘ ʟɪɴᴋ
│₊❏❜ ⋮ •revokelink ➜ ʀꜱᴇᴛ ɢʀᴏᴜᴘ ʟɪɴᴋ
│₊❏❜ ⋮ •leave ➜ ʟᴇᴀᴠᴇ ᴛʜᴇ ɢʀᴏᴜᴘ
╰──────────────────<𝟑
╭─⊹₊⟡⋆『 \`𝐀𝐈 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •akira ➜ ᴀᴋɪʀᴀ ᴀɪ ɢɪʀʟꜰʀɪᴇɴᴅ
╰──────────────────<𝟑
╭─⊹₊⟡⋆『 \`𝐅𝐮𝐧 𝐂𝐦𝐝𝐳\` 』𖤐.ᐟ
│₊❏❜ ⋮ •lvcal ➜ ʟᴏᴠᴇ ᴄᴀʟᴄᴜʟᴀᴛᴇʀ
│₊❏❜ ⋮ •hentai ➜ ɢᴇᴛ ʜᴇɴᴛᴀɪ ᴠɪᴅᴇᴏ(18+)
│₊❏❜ ⋮ •hack ➜ ꜱᴇɴᴅ ʜᴀᴄᴋɪɴɢ ᴍꜱɢ
╰──────────────────<𝟑

> *𝗔esthatic 𝗤ueen 𝗕y 𝗖hamod 𝜗𝜚⋆*`,
        contextInfo: arabianCtx()
      }, { quoted: msg });
        }
    }
};
