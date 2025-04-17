function startMatrix() {
    try {
        const sdk = require("matrix-js-sdk");
        const showdown = require('showdown');

        global.matrixSend = async (room, message, data) => {
            await client.sendEvent(room, "m.room.message", {
                msgtype: "m.text",
                body: data ?? message,
                format: "org.matrix.custom.html",
                formatted_body: markdown(message),
            });
        }

        global.markdown = (text) => {
            let converter = new showdown.Converter();
            return converter.makeHtml(text);
        }

        const client = sdk.createClient({
            baseUrl: "https://chat.equestria.dev",
            userId: require('./credentials.json').username,
            accessToken: require('./credentials.json').token
        });

        (async () => {
            await client.startClient({ initialSyncLimit: 0 });

            client.once("sync", async function (state, prevState, res) {
                if (state === "PREPARED") {
                    console.log("Ready!");

                    client.setPresence({
                        presence: "online"
                    });
                } else {
                    console.log(state);
                    process.exit(1);
                }
            });

            client.on("Room.timeline", function (event, room) {
                if (event.getType() !== "m.room.message") {
                    return;
                }

                if (new Date().getTime() - event.event.origin_server_ts < 1000 && event.sender.userId !== require('./credentials.json').username) {
                    let message = event.event.content.body;

                    if (event.event.content.formatted_body && event.event.content.formatted_body.startsWith("<mx-reply>")) {
                        message = event.event.content.formatted_body.split("</mx-reply>")[1];
                    }

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
                                source: "matrix",
                                event,
                                room,
                                client
                            });
                        } catch (e) {
                            matrixSend(room.roomId, "❓ Hmm, something isn't quite right! I was trying to process your message and something wrong happened. I think you need to report this so it can be fixed!\n\n<details><summary>Show stack trace</summary>\n\n```plaintext\n" + e.stack + "\n```\n\n</details>");
                        }
                    } else if (message.includes(require('./credentials.json').username) || (event.event.content.formatted_body && event.event.content.formatted_body.includes(require('./credentials.json').username))) {
                        matrixSend(room.roomId, "👋 Hello! I think you forgot my prefix is `.`, use `.help` to get help.");
                    }
                }
            });

            client.on("RoomMember.membership", function (event, member) {
                if (member.membership === "invite" && member.userId === require('./credentials.json').username) {
                    client.joinRoom(member.roomId).then(function () {
                        console.log("Auto-joined %s", member.roomId);
                    });
                }
            });
        })();
    } catch (e) {
        console.error(e);

        setTimeout(() => {
            startMatrix();
        }, 300000);
    }
}

startMatrix();