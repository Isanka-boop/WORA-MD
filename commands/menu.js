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
        text: `*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗠𝗲𝗻𝘂 🎀] ¡! ❞*

♡︎ ━━━━━━━━━━━━━━━ ♡︎
   𓆩 赤い糸 𓆪
♡︎ ━━━━━━━━━━━━━━━ ♡︎

👤 𝐔𝐬𝐞𝐫   : ${pushname}
📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 𝐕1.0.0
📅 𝐃𝐚𝐭𝐞   : ${slDate}
⌚ 𝐓𝐢𝐦𝐞   : ${slTimeNow}

╭─── 𓆩♡𓆪 𝐌𝐀𝐈𝐍 𝐂𝐌𝐃𝐙 𓆩♡𓆪 ───╮
│ ✧ .menu   ➜ Command List
│ ✧ .system ➜ System Info  
│ ✧ .ping   ➜ Bot Speed
│ ✧ .alive  ➜ Check Alive
│ ✧ .owner  ➜ Owner Info
╰────────────────────────╯

╭─── 𓆩♡𓆪 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𓆩♡𓆪 ───╮
│ ✧ .song  ➜ Download Song
│ ✧ .video ➜ Download Video
│ ✧ .fb    ➜ FB Video DL
│ ✧ .tt    ➜ TikTok DL
╰────────────────────────╯

╭─── 𓆩♡𓆪 𝐓𝐎𝐋𝐒 𓆩♡𓆪 ───╮
│ ✧ .vv       ➜ ViewOnce Open
│ ✧ .sticker  ➜ Image to Sticker
│ ✧ .fancy    ➜ Fancy Text
│ ✧ .getdp    ➜ Get Profile Pic
│ ✧ .npm      ➜ Search NPM
│ ✧ .img      ➜ Search Images
│ ✧ .mode     ➜ Change Bot Mode
╰────────────────────────╯

╭─── 𓆩♡𓆪 𝐆𝐑𝐎𝐔𝐏 𓆩♡𓆪 ───╮
│ ✧ .tagall    ➜ Tag Everyone
│ ✧ .hidetag   ➜ Silent Tag
│ ✧ .add       ➜ Add Member
│ ✧ .kick      ➜ Kick Member
│ ✧ .tagadmin  ➜ Tag Admins
│ ✧ .promote   ➜ Make Admin
│ ✧ .demote    ➜ Remove Admin
│ ✧ .lockgroup ➜ Lock Group
│ ✧ .unlockgroup ➜ Unlock
│ ✧ .mute      ➜ Mute Group
│ ✧ .unmute    ➜ Unmute
│ ✧ .setname   ➜ Set Name
│ ✧ .setdesc   ➜ Set Desc
│ ✧ .seticon   ➜ Set Icon
│ ✧ .linkgroup ➜ Group Link
│ ✧ .revokelink➜ Reset Link
│ ✧ .leave     ➜ Leave Group
╰────────────────────────╯

╭─── 𓆩♡𓆪 𝐀𝐈 & 𝐅𝐔𝐍 𓆩♡𓆪 ───╮
│ ✧ .akira ➜ Talk to Akira AI
│ ✧ .lvcal ➜ Love Calculator
│ ✧ .hentai➜ Hentai Video 18+
│ ✧ .hack  ➜ Fake Hack Prank
╰────────────────────────╯

> ♡ 𝗔𝗲𝘀𝘁𝗵𝗮𝘁𝗶𝗰 𝗤𝘂𝗲𝗻 𝗕𝘆 𝗖𝗵𝗮𝗺𝗼𝗱 ♡
        contextInfo: arabianCtx()
      }, { quoted: msg });
        }
    }
};
