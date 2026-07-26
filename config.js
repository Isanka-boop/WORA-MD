/*
  Central bot configuration.
  All values can be overridden from the .env file in the project root
  (see .env.example for the full list). Anything not set in .env falls
  back to the default shown below, so the bot still runs without a .env.
*/

require('dotenv').config();

const config = {
    // Identity — shown in menu headers, sticker packs, .owner command, etc.
    BOT_NAME: process.env.BOT_NAME || '𝗩𝗜𝗣𝗘𝗥 𝗠𝗗',
    OWNER_NAME: process.env.OWNER_NAME || '𝗜𝗦𝗔𝗡𝗞𝗔',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '94763353368', // digits only, no +
    STICKER_AUTHOR: process.env.STICKER_AUTHOR || process.env.OWNER_NAME || '𝗜𝗦𝗔𝗡𝗞𝗔',

    // Behaviour
    AUTO_VIEW_STATUS: process.env.AUTO_VIEW_STATUS || 'true',
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'true',
    MODE: process.env.MODE || 'public',
    PREFIX: process.env.PREFIX || '.',
    MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
    ADMIN_LIST_PATH: process.env.ADMIN_LIST_PATH || './admin.json',

    // Branding / links
    AKIRA_IMG: process.env.BOT_IMG || 'https://i.ibb.co/FZjptLY/tourl-1779693358137.jpg',
    NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363399723529947@newsletter',
    NEWSLETTER_LIST: process.env.NEWSLETTER_LIST
        ? process.env.NEWSLETTER_LIST.split(',').map(s => s.trim()).filter(Boolean)
        : ['120363399723529947@newsletter'],
    NEWSLETTER_MESSAGE_ID: process.env.NEWSLETTER_MESSAGE_ID || '428',
    OTP_EXPIRY: Number(process.env.OTP_EXPIRY) || 300000,
    CHANNEL_LINK: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/0029VbAp1d6HVvTSFTYtco0T',

    // Infra
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://maliquotes6_db_user:FlDox4Qcie9JUzZ9@cluster0.bbsrc3v.mongodb.net/?appName=Cluster0',
    PM2_NAME: process.env.PM2_NAME || 'dtz-mini-bot-session'
};

module.exports = config;
