/*
  Command: song, ytmp3
*/

module.exports = {
    name: 'song',
    aliases: ['ytmp3'],

    execute: async (ctx) => {

        const {
            socket,
            sender,
            msg,
            args,
            reply,
            yts,
            axios,
            arabianCtx
        } = ctx;


        try {

            const query = args.join(" ");

            if (!query) {
                return reply("🎵 *Please send a song name!*");
            }


            try {
                await socket.sendMessage(sender,{
                    react:{
                        text:"🔎",
                        key:msg.key
                    }
                });
            } catch (_) {}



            // Search YouTube
            const search = await yts(query);

            const video = search.videos[0];


            if (!video) {
                return reply("❌ *Song not found!*");
            }



            const apiUrl =
            `https://whiteshadow-x-api.onrender.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}&quality=320&apitoken=aWK0z4`;



            const response = await axios.get(apiUrl);



            const downloadUrl =
                response.data.result?.download ||
                response.data.result?.url ||
                response.data.download ||
                response.data.download_url ||
                response.data.url;



            if (!downloadUrl) {
                return reply("❌ MP3 download link not found!");
            }




            // Send song info

            const caption =
`*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗠𝘂𝘀𝗶𝗰 🎀] ❞*

> 🎵 *Title:* ${video.title}

> 👤 *Channel:* ${video.author.name}

> ⏱ *Duration:* ${video.timestamp}

> 👀 *Views:* ${video.views.toLocaleString()}


> ✨ 𝐎𝐰𝐧𝐞𝐫 𝐁𝐲 𝐂𝐡𝐚𝐦𝐨𝐝 ...`;




            await socket.sendMessage(sender,{

                image:{
                    url:video.thumbnail
                },

                caption:caption,

                contextInfo:arabianCtx()

            },{
                quoted:msg
            });






            // Send MP3 directly

            await socket.sendMessage(sender,{

                audio:{
                    url:downloadUrl
                },

                mimetype:"audio/mpeg",

                fileName:`${video.title}.mp3`,

                ptt:false

            },{
                quoted:msg
            });



            try {
                await socket.sendMessage(sender,{
                    react:{
                        text:"✅",
                        key:msg.key
                    }
                });
            } catch (_) {}



        } catch(e) {

            console.log("SONG ERROR:", e);

            reply(
                "❌ Song command error:\n" +
                e.message
            );
        }

    }
};
