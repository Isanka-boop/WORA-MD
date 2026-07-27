/*
 Command:
 .welcome on/off
 .welmsg text
 .welmention on/off
 .weltheme 1
 .welang si/en
 .welldelay 5
 .welgoodbye on/off
 .welog on/off
*/

module.exports = {

    name: "welcome",
    aliases: ["wc"],


    execute: async (ctx) => {

        const {
            socket,
            sender,
            args,
            isGroup,
            isAdmins,
            isOwner,
            reply,
            loadUserConfig,
            updateUserConfig
        } = ctx;


        if (!isGroup)
            return reply("❌ Group only.");


        if (!isAdmins && !isOwner)
            return reply("❌ Admin only.");


        let config = loadUserConfig(sender) || {};


        const option = args[0];


        switch(option) {


            case "on":

                config.welcome = true;
                updateUserConfig(sender, config);

                return reply("✅ Welcome enabled.");


            case "off":

                config.welcome = false;
                updateUserConfig(sender, config);

                return reply("❌ Welcome disabled.");


            case "msg":

                config.welcomeMsg =
                args.slice(1).join(" ") || "Welcome @user ❤️";

                updateUserConfig(sender, config);

                return reply("✅ Welcome message saved.");


            case "mention":

                config.mention =
                args[1] === "on";

                updateUserConfig(sender, config);

                return reply(
                    `✅ Mention ${config.mention ? "ON":"OFF"}`
                );


            case "theme":

                config.theme =
                args[1] || "1";

                updateUserConfig(sender, config);

                return reply("✅ Theme saved.");


            case "lang":

                config.lang =
                args[1] || "en";

                updateUserConfig(sender, config);

                return reply("✅ Language saved.");


            case "delay":

                config.delay =
                Number(args[1] || 0);

                updateUserConfig(sender, config);

                return reply("✅ Delay saved.");


            case "goodbye":

                config.goodbye =
                args[1] === "on";

                updateUserConfig(sender, config);

                return reply("✅ Goodbye setting updated.");


            case "log":

                config.log =
                args[1] === "on";

                updateUserConfig(sender, config);

                return reply("✅ Log setting updated.");


            default:

                return reply(
`╭━━〔 WELCOME SETTINGS 〕━━╮

.welcome on
.welcome off

.welcome msg Hello @user ❤️

.welcome mention on/off

.welcome theme 1

.welcome lang si/en

.welcome delay 5

.welcome goodbye on/off

.welcome log on/off

╰━━━━━━━━━━━━━━━━━━╯`
                );

        }

    },



    init: async (ctx)=>{

        const {
            socket,
            loadUserConfig
        } = ctx;


        let welcomed = [];


        socket.ev.on(
        "group-participants.update",
        async(update)=>{


            try {


                const groupId = update.id;


                let config =
                loadUserConfig(groupId) || {};



                if(update.action === "add"){



                    if(!config.welcome)
                    return;



                    for(const user of update.participants){



                        if(welcomed.includes(user))
                        return;


                        welcomed.push(user);



                        const number =
                        user.split("@")[0];



                        if(config.delay){

                            await new Promise(
                                r=>setTimeout(
                                r,
                                config.delay * 1000
                                )
                            );

                        }



                        const metadata =
                        await socket.groupMetadata(
                            groupId
                        );



                        const banner =

`https://hashu-apis-official.onrender.com/api/welcomebanner?apiKey=hashu_f734afee39f42a269369335194b5aa8e&name=${number}&group=${encodeURIComponent(metadata.subject)}&theme=${config.theme || 1}`;



                        let text =
                        config.welcomeMsg ||
                        "Welcome @user ❤️";


                        text =
                        text.replace(
                            "@user",
                            `@${number}`
                        );



                        await socket.sendMessage(
                            groupId,
                            {

                                image:{
                                    url:banner
                                },


                                caption:
`${text}

👥 Group:
${metadata.subject}`,

                                mentions:
                                config.mention === false
                                ? []
                                : [user]

                            }
                        );



                        if(config.log){


                            await socket.sendMessage(
                                groupId,
                                {
                                    text:
`📌 Welcome Log

User:
@${number}

Group:
${metadata.subject}`,

                                    mentions:[user]
                                }
                            );

                        }


                    }


                }



                if(update.action === "remove"){



                    if(!config.goodbye)
                    return;



                    for(const user of update.participants){


                        const number =
                        user.split("@")[0];



                        await socket.sendMessage(
                            groupId,
                            {

                                text:
`👋 Goodbye @${number}

We will miss you ❤️`,

                                mentions:[user]

                            }
                        );


                    }


                }



            } catch(e){

                console.log(
                    "Welcome Error:",
                    e
                );

            }


        });


    }

};
