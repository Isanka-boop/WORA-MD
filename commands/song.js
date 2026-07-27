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
            body,
            reply,
            yts,
            axios,
            moment,
            arabianCtx
        } = ctx;


        try {

            global.songCache = global.songCache || {};


            // Button Response Handler
            const buttonId =
                msg.message?.buttonsResponseMessage?.selectedButtonId ||
                msg.message?.templateButtonReplyMessage?.selectedId ||
                body;



            // Download Button Click
            if (buttonId === "download_mp3") {


                const song = global.songCache[sender];


                if (!song) {
                    return reply("❌ Song expired. Please search again!");
                }



                try {
                    await socket.sendMessage(sender,{
                        react:{
                            text:"⬇️",
                            key:msg.key
                        }
                    });
                } catch (_) {}



                const apiUrl =
                `https://whiteshadow-x-api.onrender.com/api/download/ytmp3?url=${encodeURIComponent(song.url)}&quality=320&apitoken=aWK0z4`;



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



                await socket.sendMessage(sender,{

                    audio:{
                        url:downloadUrl
                    },

                    mimetype:"audio/mpeg",

                    fileName:`${song.title}.mp3`,

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

                return;
            }





            // Search Song

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





            const search = await yts(query);


            const video = search.videos[0];



            if (!video) {
                return reply("❌ *Song not found!*");
            }




            global.songCache[sender] = {

                url: video.url,

                title: video.title,

                created: Date.now()

            };





            const date = moment()
                .tz("Asia/Colombo")
                .format("YYYY-MM-DD");


            const time = moment()
                .tz("Asia/Colombo")
                .format("HH:mm:ss");





            const caption =
`*↳ ❝ [🎀 𝗔𝗸𝗶𝗿𝗮 𝗚𝗶𝗿𝗹 𝗠𝘂𝘀𝗶𝗰 🎀] ❞*

> 🎵 *Title:* ${video.title}

> 👤 *Channel:* ${video.author.name}

> ⏱ *Duration:* ${video.timestamp}

> 👀 *Views:* ${video.views.toLocaleString()}

> 📅 *Date:* ${date}

> ⌚ *Time:* ${time}


> ✨ Powered By Akira Girl Bot`;







            // Send Thumbnail

            await socket.sendMessage(sender,{

                image:{
                    url:video.thumbnail
                },

                caption:caption,

                contextInfo:arabianCtx()

            },{
                quoted:msg
            });







            // Send Button Separately

            await socket.sendMessage(sender,{

                text:"🎵 Download your song below",

                footer:"🎀 Akira Music Downloader",

                buttons:[

                    {
                        buttonId:"download_mp3",

                        buttonText:{
                            displayText:"🎵 Download MP3"
                        },

                        type:1
                    }

                ],

                headerType:1,

                contextInfo:arabianCtx()

            },{
                quoted:msg
            });




        } catch(e) {

            console.log("SONG ERROR:", e);

            reply(
                "❌ Song command error:\n" +
                e.message
            );
        }

    }
};
