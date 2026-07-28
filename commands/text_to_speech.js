/*
  Command: tts
  Google/WhiteShadow TTS API integration for WhatsApp bot
*/
module.exports = {
    name: 'tts',
    aliases: ['speak', 'say'],
    execute: async (ctx) => {
        const {
            socket,
            sender,
            msg,
            text,
            args,
            reply,
            arabianCtx,
            axios,
            fs,
            path
        } = ctx;

        try {
            // 1) Get the text to convert. Supports: .tts <text>  OR replying to a message with .tts
            const quotedText = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
            const inputText = (text && text.trim()) || (quotedText && quotedText.trim());

            if (!inputText) {
                return reply('*✦ උදාහරණය:* `.tts ඔයාට කොහොමද මචං?`\n*✦ Optional lang:* `.tts si | ඔයාට කොහොමද?`');
            }

            // 2) Optional language code parsing -> ".tts si | ඔයාට කොහොමද?" or default "si"
            let lang = 'si';
            let finalText = inputText;
            if (inputText.includes('|')) {
                const [maybeLang, ...rest] = inputText.split('|');
                if (maybeLang.trim().length <= 5) {
                    lang = maybeLang.trim();
                    finalText = rest.join('|').trim();
                }
            }

            if (!finalText) {
                return reply('❌ *කරුණාකර text එකක් දෙන්න.*');
            }

            // React to show it's processing
            socket.sendMessage(sender, { react: { text: '🎙️', key: msg.key } }).catch(() => {});

            // 3) Build API URL
            const apiToken = 'aWK0z4'; // move this to config/env in production
            const ttsUrl = `https://whiteshadow-x-api.onrender.com/api/tools/tts?text=${encodeURIComponent(finalText)}&lang=${encodeURIComponent(lang)}&apitoken=${apiToken}`;

            // 4) Fetch audio as buffer
            const response = await axios.get(ttsUrl, { responseType: 'arraybuffer', timeout: 30000 });

            // Basic sanity check — some APIs return JSON error instead of audio on failure
            const contentType = response.headers['content-type'] || '';
            if (!contentType.includes('audio')) {
                let errMsg = 'Unknown error';
                try {
                    errMsg = JSON.parse(Buffer.from(response.data).toString('utf-8'))?.message || errMsg;
                } catch (_) {}
                return reply(`❌ *TTS API එකෙන් audio එකක් ආවේ නැහැ.*\n➜ ${errMsg}`);
            }

            const audioBuffer = Buffer.from(response.data);

            // 5) Send as voice note (PTT). Change ptt:false if you want it as a normal audio file.
            await socket.sendMessage(sender, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: true,
                contextInfo: arabianCtx ? arabianCtx() : undefined
            }, { quoted: msg });

        } catch (err) {
            console.error('[TTS ERROR]', err?.message || err);
            reply(`❌ *TTS command එකේ error එකක් ආවා:*\n➜ ${err?.message || 'Unknown error'}`);
        }
    }
};
