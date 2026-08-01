/*
Command: menu, list, panel
ZETA-MD - Aesthetic Menu v2
*/
module.exports = {
name: 'menu',
aliases: ['list', 'panel'],
execute: async (ctx) => {
const {
socket, msg, sender, arabianCtx, moment
} = ctx;

socket.sendMessage(sender, { react: { text: '🎀', key: msg.key } }).catch(() => {});

const pushname = msg.pushName || 'User';
const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
const slTimeNow = moment().tz('Asia/Colombo').format('HH:mm:ss');

// දවසින් දවස වෙනස් වෙන about quotes
const aboutList = [
  "🌸 \"Soft girls run the world with kindness and code.\"",
  "💖 \"Be the girl who decided to go for it.\"",
  "🦋 \"ZETA-MD is not just a bot, she's your vibe.\"",
  "✨ \"Dream big, code harder, glow up daily.\"",
  "🌙 \"Late nights + Coffee + Code = Magic\"",
  "🎀 \"Elegance is the only beauty that never fades.\"",
  "👑 \"Built with love by Chamod, for queens like you.\"",
  "💫 \"Your bot, your rules, your aesthetic.\""
];
const dayIndex = new Date().getDate() % aboutList.length; // දවස අනුව වෙනස් වෙනවා
const dailyAbout = aboutList[dayIndex];

const menuText = `
╔══════════════════════════════╗
          🌸 𝐙𝐄𝐓𝐀-𝐌𝐃 🌸
         『 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐖𝐀 𝐁𝐨𝐭 』
╚══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 𝐔𝐒𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👑 Name     : ${pushname}
┃ 📦 Version  : V1.0.0
┃ 📅 Date     : ${slDate}
┃ ⏰ Time     : ${slTimeNow}
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🏠 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ✦ .menu
┃ ✦ .system
┃ ✦ .ping
┃ ✦ .alive
┃ ✦ .owner
┃ ✦ .wallpaper
┃ ✦ .nasa
┃ ✦ .currency
┃ ✦ .gemini
┃ ✦ .autoreact on/off
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ ⬇️ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🎵 .song
┃ 🎥 .video
┃ 📘 .fb
┃ 🎶 .tt
┃ 🎉 .holidays
┃ 🖼 .text2img
┃ 🔗 .short
┃ 📚 .pastpaper
┃ 🦋 .emoji (ex:cat)
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🛠️ 𝐓𝐎𝐎𝐋𝐒
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🖼 .vv
┃ 🎭 .sticker
┃ ✨ .fancy
┃ 👤 .getdp
┃ 📦 .npm
┃ 🔎 .img
┃ ⚙️ .mode
┃ 👋 .welcome
┃ 🔊 .tts
┃ 💬 .quote
┃ 🔐 .password
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 👥 𝐆𝐑𝐎𝐔𝐏 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📢 .tagall
┃ 👻 .hidetag
┃ ➕ .add
┃ ❌ .kick
┃ 👑 .promote
┃ 📥 .demote
┃ 🔒 .lockgroup
┃ 🔓 .unlockgroup
┃ 🔇 .mute
┃ 🔊 .unmute
┃ ✏️ .setname
┃ 📝 .setdesc
┃ 🖼 .seticon
┃ 🔗 .linkgroup
┃ ♻️ .revokelink
┃ 👋 .leave
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 🤖 𝐀𝐈 & 𝐅𝐔𝐍
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 💖 .zeta
┃ ❤️ .lvcal
┃ 🎲 .truthordare
┃ 🔞 .hentai
┗━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━┓
┃ 💌 𝐓𝐎𝐃𝐀𝐘'𝐒 𝐌𝐄𝐒𝐒𝐀𝐆𝐄
┣━━━━━━━━━━━━━━━━━━━━┫
${dailyAbout}
┗━━━━━━━━━━━━━━━━━━━━┛

╔══════════════════════════════╗
🌸 ありがとう • Thank You for Using
          𝐀𝐊𝐈𝐑𝐀 𝐆𝐈𝐑𝐋 𝐌𝐃
👑 Developer : 𝐂𝐡𝐚𝐦𝐨𝐝
🤍 Made With Love
╚══════════════════════════════╝
`;

await socket.sendMessage(sender, {
text: menuText,
contextInfo: arabianCtx()
}, { quoted: msg });

}
};
