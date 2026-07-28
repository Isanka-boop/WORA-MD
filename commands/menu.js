/*
Command: menu, list, panel
AKIRA GIRL MD - Aesthetic Menu v2
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
  "🦋 \"Akira is not just a bot, she's your vibe.\"",
  "✨ \"Dream big, code harder, glow up daily.\"",
  "🌙 \"Late nights + Coffee + Code = Magic\"",
  "🎀 \"Elegance is the only beauty that never fades.\"",
  "👑 \"Built with love by Chamod, for queens like you.\"",
  "💫 \"Your bot, your rules, your aesthetic.\""
];
const dayIndex = new Date().getDate() % aboutList.length; // දවස අනුව වෙනස් වෙනවා
const dailyAbout = aboutList[dayIndex];

const menuText = `
♡︎ ━━━━━━━ 𓆩赤い糸𓆪 ━━━━━━━ ♡︎
┃ 🎀 𝐀𝐊𝐈𝐑𝐀 𝐆𝐈𝐑𝐋 𝐌𝐃 🎀
┃ 𝑨𝒆𝒔𝒕𝒉𝒂𝒕𝒊𝒄 𝑾𝑨 𝑩𝒐𝒕
♡︎ ━━━━━━━━━━━━━━━ ♡︎

╭─ 𓆩👤𓆪 𝐏𝐑𝐎𝐅𝐈𝐋𝐄
│ 👑 𝐍𝐚𝐦𝐞 : ${pushname}
│ 📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: 𝐕1.0.0
│ 📅 𝐃𝐚𝐭𝐞 : ${slDate}
│ ⏰ 𝐓𝐢𝐦𝐞 : ${slTimeNow}
╰─────────────────♡

╭─ 𓆩🏠𓆪 𝐌𝐀𝐈𝐍 𝐂𝐌𝐃𝐙
│ ✧.menu • Command List
│ ✧.system • System Info
│ ✧.ping • Bot Speed
│ ✧.alive • Check Alive
│ ✧.owner • Owner Info
│ ✧.wallpaper • Download beautiful wallpaper
│ ✧.nasa • Nasa Picture of the Day
╰─────────────────♡

╭─ 𓆩⬇️𓆪 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃
│ ✧.song • Download Song
│ ✧.video • Download Video
│ ✧.fb • Facebook DL
│ ✧.tt • TikTok DL
│ ✧.sinhalasub • sinhalasub download
╰─────────────────♡

╭─ 𓆩🛠️𓆪 𝐓𝐎𝐎𝐋𝐒
│ ✧.vv • ViewOnce Opener
│ ✧.sticker • Image > Sticker
│ ✧.fancy • Fancy Text
│ ✧.getdp • Get Profile Pic
│ ✧.npm • NPM Search
│ ✧.img • Image Search
│ ✧.mode • Bot Mode
│ ✧.welcome • Welcome Msg
│ ✧.tts • Text to speech
│ ✧.quote • Quotes Send
╰─────────────────♡

╭─ 𓆩👥𓆪 𝐆𝐑𝐎𝐔𝐏 𝐂𝐌𝐃𝐙
│ ✧.tagall.hidetag.add.kick
│ ✧.tagadmin.promote.demote
│ ✧.lockgroup.unlockgroup
│ ✧.mute.unmute.setname
│ ✧.setdesc.seticon.linkgroup
│ ✧.revokelink.leave
╰─────────────────♡

╭─ 𓆩🤖𓆪 𝐀𝐈 & 𝐅𝐔𝐍
│ ✧.akira • Talk to Akira AI
│ ✧.lvcal • Love Calculator
│ ✧.hentai• 18+ Content
│ ✧.hack • Fake Hack
╰─────────────────♡

━━━━━━━━━━━━━━━
💌 𝐀𝐁𝐎𝐔𝐓 𝐓𝐎𝐃𝐀𝐘
${dailyAbout}
━━━━━━━━━━━━━━━

🌸 𝑻𝒉𝒂𝒏𝒌 𝒀𝒐𝒖 𝒇𝒐𝒓 𝑼𝒔𝒊𝒏𝒈 𝑨𝒌𝒊𝒓𝒂 🌸
👑 𝑫𝒆𝒗 : 𝐂𝐡𝐚𝐦𝐨𝐝 | 🫶🤍 𝑴𝒂𝒅𝒆 𝒘𝒊𝒕𝒉 𝑳𝒐𝒗𝒆
`;

await socket.sendMessage(sender, {
text: menuText,
contextInfo: arabianCtx()
}, { quoted: msg });

}
};
