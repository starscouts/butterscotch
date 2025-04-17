function startSignal() {
    try {
        const { Client } = require('@equestria.dev/signal.js');

        async function send(channel, text, options) {
            await channel.setTyping(false);

            if (!options) options = {};
            options.markdown = true;

            await channel.send(text, options);
        }

        global.signalSend = send;

        const client = new Client({
            account: require('./credentials.json').signal
        });

        client.on('message', async (msg) => {
            console.log(msg);
            if (!require('./credentials.json').allowed.includes(msg.author.number)) return;
            let message = msg.content;

            if (message.startsWith(".") && !message.startsWith("..") && message.trim() !== "." && message.trim() !== ".c." && !message.trim().startsWith(".c.") && !message.trim().startsWith(".❤️")) {
                let command;

                msg.channel.setTyping(true);
                msg.markAsRead();

                try {
                    command = message.replaceAll(/ +/g, " ");
                    if (command.startsWith(". ")) command = "." + command.substring(2);
                    command = command.split(" ")[0].substring(1).replaceAll("/", "-");
                    let parameter = message.split(" ").splice(1).join(" ");

                    require('./handler')({
                        command,
                        parameter,
                        source: "signal",
                        message: msg,
                        channel: msg.channel,
                        client,
                        signalSend: send
                    });
                } catch (e) {
                    send(msg.channel, "❓ Hmm, something isn't quite right! I was trying to process your message and something wrong happened. I think you need to report this so it can be fixed!\n\n```plaintext\n" + e.stack + "\n```");
                }
            } else if (msg.mentions?.map(i => i.number).includes(require('./credentials.json').signal)) {
                send(msg.channel, "👋 Hello! I think you forgot my prefix is `.`, use `.help` to get help.");
            }
        });
    } catch (e) {
        console.error(e);

        setTimeout(() => {
            startSignal();
        }, 300000);
    }
}

startSignal();