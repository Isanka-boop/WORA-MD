/*
Command: menu, list, panel
ZETA-MD - Modern Cyber-Aesthetic Menu v3
*/
module.exports = {
    name: 'menu',
    aliases: ['list', 'panel'],
    execute: async (ctx) => {
        const {
            socket, msg, sender, arabianCtx, moment
        } = ctx;

        // React with star emoji
        socket.sendMessage(sender, { react: { text: '✨', key: msg.key } }).catch(() => {});

        const pushname = msg.pushName || 'User';
        const slDate = moment().tz('Asia/Colombo').format('YYYY.MM.DD');
        const slDay = moment().tz('Asia/Colombo').format('dddd');
        const slTimeNow = moment().tz('Asia/Colombo').format('hh:mm:ss A');

        // දවසින් දවස වෙනස් වෙන quotes
        const aboutList = [
            "🌸 *\"Soft girls run the world with kindness and code.\"*",
            "💖 *\"Be the girl who decided to go for it.\"*",
            "🦋 *\"ZETA-MD is not just a bot, she's your vibe.\"*",
            "✨ *\"Dream big, code harder, glow up daily.\"*",
            "🌙 *\"Late nights + Coffee + Code = Magic\"*",
            "🎀 *\"Elegance is the only beauty that never fades.\"*",
            "👑 *\"Built with love by Isanka, for queens like you.\"*",
            "💫 *\"Your bot, your rules, your aesthetic.\"*"
        ];
        const dayIndex = new Date().getDate() % aboutList.length;
        const dailyAbout = aboutList[dayIndex];

        const menuText = `
╭━━━〔 𝐙𝐄𝐓𝐀-𝐌𝐃 𝐕𝟐.𝟎 〕━━━╮

  ╭─► 👤 *USER DASHBOARD*
  │ ├ 👑 *Owner* : 𝐈𝐬𝐚𝐧𝐤𝐚
  │ ├ 👤 *User* : *${pushname}*
  │ ├ 📅 *Date* : *${slDate}*
  │ ├ 📆 *Day* : \`${slDay}\`
  │ └ ⏰ *Time* : *${slTimeNow}*
  ╰──────────────────────

 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
   ▸ 🏠 *MAIN COMMANDS*
 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
  ║ ✧ \`.menu\`
  ║ ✧ \`.system\`
  ║ ✧ \`.ping\`
  ║ ✧ \`.alive\`
  ║ ✧ \`.owner\`
  ║ ✧ \`.wallpaper\`
  ║ ✧ \`.nasa\`
  ║ ✧ \`.currency\`
  ║ ✧ \`.gemini\`
  ║ ✧ \`.autoreact on/off\`

 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
   ▸ ⬇️ *DOWNLOAD CENTER*
 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
  ║ 🎵 \`.song\`
  ║ 🎥 \`.video\`
  ║ 📘 \`.fb\`
  ║ 🎶 \`.tt\`
  ║ 🎉 \`.holidays\`
  ║ 🖼 \`.text2img\`
  ║ 🔗 \`.short\`
  ║ 📚 \`.pastpaper\`
  ║ 🦋 \`.emoji\`

 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
   ▸ 🛠️ *UTILITY TOOLS*
 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
  ║ 🖼 \`.vv\`
  ║ 🎭 \`.sticker\`
  ║ ✨ \`.fancy\`
  ║ 👤 \`.getdp\`
  ║ 📦 \`.npm\`
  ║ 🔎 \`.img\`
  ║ ⚙️ \`.mode\`
  ║ 👋 \`.welcome\`
  ║ 🔊 \`.tts\`
  ║ 💬 \`.quote\`
  ║ 🔐 \`.password\`

 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
   ▸ 👥 *GROUP CONTROL*
 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
  ║ 📢 \`.tagall\`
  ║ 👻 \`.hidetag\`
  ║ ➕ \`.add\`
  ║ ❌ \`.kick\`
  ║ 👑 \`.promote\`
  ║ 📥 \`.demote\`
  ║ 🔒 \`.lockgroup\`
  ║ 🔓 \`.unlockgroup\`
  ║ 🔇 \`.mute\`
  ║ 🔊 \`.unmute\`
  ║ ✏️ \`.setname\`
  ║ 📝 \`.setdesc\`
  ║ 🖼 \`.seticon\`
  ║ 🔗 \`.linkgroup\`
  ║ ♻️ \`.revokelink\`
  ║ 👋 \`.leave\`

 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
   ▸ 🤖 *AI & ENTERTAINMENT*
 ⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼⎼
  ║ 💖 \`.zeta\`
  ║ ❤️ \`.lvcal\`
  ║ 🎲 \`.truthordare\`

 ┌──────────────────────────┐
   💬 *QUOTE OF THE DAY*
   ${dailyAbout}
 └──────────────────────────┘

 ╰━━━〔 𝐙𝐄𝐓𝐀-𝐌𝐃 • 𝐁𝐘 𝐈𝐒𝐀𝐍𝐊𝐀 〕━━━╯
`;

        await socket.sendMessage(sender, {
            text: menuText,
            contextInfo: arabianCtx()
        }, { quoted: msg });

    }
};

