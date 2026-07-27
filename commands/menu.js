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
      // PERF: react is fire-and-forget (not awaited) so it can't block the reply.
      socket.sendMessage(sender, { react: { text: '🎀', key: msg.key } }).catch(() => {});
      
      const start = Date.now();
      const ms    = Date.now() - start;
      const pushname = msg.pushName || 'User';
      const readMore = String.fromCharCode(8206).repeat(4000);
      

      const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
      const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

      // PERF: plain text instead of image: {url} — no remote fetch + re-upload delay.
      await socket.sendMessage(sender, {
  text: `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃      🎀 𝐀𝐊𝐈𝐑𝐀 𝐆𝐈𝐑𝐋 🎀
┃         𝑾𝒉𝒂𝒕𝒔𝑨𝒑𝒑 𝑩𝒐𝒕
╰━━━━━━━━━━━━━━━━━━━━━━━╯

╭─〔 👤 𝐔𝐒𝐄𝐑 〕─⬣
│ 👑 Name    : ${pushname}
│ 📦 Version : V1.0.0
│ 📅 Date    : ${slDate}
│ ⏰ Time    : ${slTimeNow}
╰────────────⬣

╭─〔 🏠 𝐌𝐀𝐈𝐍 〕─⬣
│ ✦ .menu
│ ✦ .system
│ ✦ .ping
│ ✦ .alive
│ ✦ .owner
╰────────────⬣

╭─〔 ⬇️ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 〕─⬣
│ 🎵 .song
│ 🎥 .video
│ 📘 .fb
│ 🎶 .tt
╰────────────⬣

╭─〔 🛠️ 𝐓𝐎𝐎𝐋𝐒 〕─⬣
│ ✨ .vv
│ 🖼️ .sticker
│ 🔠 .fancy
│ 👤 .getdp
│ 📦 .npm
│ 🌄 .img
│ ⚙️ .mode
│🫶  .welcome
╰────────────⬣

╭─〔 👥 𝐆𝐑𝐎𝐔𝐏 〕─⬣
│ 📢 .tagall
│ 👻 .hidetag
│ ➕ .add
│ ❌ .kick
│ 👮 .tagadmin
│ ⬆️ .promote
│ ⬇️ .demote
│ 🔒 .lockgroup
│ 🔓 .unlockgroup
│ 🔇 .mute
│ 🔊 .unmute
│ 📝 .setname
│ 📄 .setdesc
│ 🖼️ .seticon
│ 🔗 .linkgroup
│ ♻️ .revokelink
│ 🚪 .leave
╰────────────⬣

╭─〔 🤖 𝐀𝐈 & 𝐅𝐔𝐍 〕─⬣
│ 💬 .akira
│ ❤️ .lvcal
│ 🔞 .hentai
│ 💻 .hack
╰────────────⬣

━━━━━━━━━━━━━━━━━━━━━━━
🌸 𝑻𝒉𝒂𝒏𝒌 𝒀𝒐𝒖 𝒇𝒐𝒓 𝑼𝒔𝒊𝒏𝒈
      🎀 𝐀𝐊𝐈𝐑𝐀 𝐆𝐈𝐑𝐋 🎀
━━━━━━━━━━━━━━━━━━━━━━━
👑 Developer : *𝐂𝐡𝐚𝐦𝐨𝐝*
💖 Made With 𝐂𝐡𝐚𝐦𝐨𝐝
━━━━━━━━━━━━━━━━━━━━━━━
`,
  contextInfo: arabianCtx()
}, { quoted: msg });
        }
    }
};

