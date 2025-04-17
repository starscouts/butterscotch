function startDiscord() {
    try {
        const { Client, GatewayIntentBits } = require('discord.js');
        const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });

        function send(channel, text) {
            channel.send({
                embeds: [
                    {
                        description: text
                    }
                ]
            })
        }

        client.on('messageCreate', (msg) => {
            if (!msg.guild || msg.author.bot) return;

            let message = msg.content;

            if (message.startsWith(".") && !message.startsWith("..") && message.trim() !== "." && message.trim() !== ".c." && !message.trim().startsWith(".c.") && !message.trim().startsWith(".❤️")) {
                let command;

                try {
                    command = message.replaceAll(/ +/g, " ");
                    if (command.startsWith(". ")) command = "." + command.substring(2);
                    command = command.split(" ")[0].substring(1).replaceAll("/", "-");
                    let parameter = message.split(" ").splice(1).join(" ");

                    require('./handler')({
                        command,
                        parameter,
                        source: "discord",
                        message: msg,
                        channel: msg.channel,
                        client,
                        discordSend: send
                    });
                } catch (e) {
                    send(msg.channel, "❓ Hmm, something isn't quite right! I was trying to process your message and something wrong happened. I think you need to report this so it can be fixed!\n\n```plaintext\n" + e.stack + "\n```");
                }
            } else if (message.includes("<@" + client.user.id + ">")) {
                send(msg.channel, "👋 Hello! I think you forgot my prefix is `.`, use `.help` to get help.");
            }
        });

        client.login(require('./credentials.json').discord);
    } catch (e) {
        console.error(e);

        setTimeout(() => {
            startDiscord();
        }, 300000);
    }
}

startDiscord();