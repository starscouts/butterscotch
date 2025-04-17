const fs = require("fs");
const { AttachmentBuilder } = require('discord.js');
const SignalAttachmentBuilder = require('@equestria.dev/signal.js').AttachmentBuilder;

module.exports = (config) => {
    let command = config['command'].replace(/[^a-zA-Z\d]/gm, "-");
    let strictMode = false;
    let start = new Date().getTime();

    if (config['command'].startsWith("!")) {
        strictMode = true;
        command = command.substring(1);
    }

    let parameter = config['parameter'];
    let wrapper = {};

    if (config['source'] === "matrix") {
        wrapper.lib = "matrix-js-sdk";
        wrapper.version = require('./node_modules/matrix-js-sdk/package.json').version;

        wrapper.send = (message) => {
            return new Promise((res) => {
                matrixSend(config['room'].roomId, message).then((msg) => {
                    if (strictMode) {
                        matrixSend(config['room'].roomId, "`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`").then(() => {
                            res(msg);
                        });
                    } else {
                        res(msg);
                    }
                });
            });
        }

        wrapper.image = async (buffer, imgConfig, text) => {
            let upload = await config['client'].uploadContent(buffer);

            config['client'].sendEvent(config['room'].roomId, "m.room.message", {
                ...{
                    msgtype: "m.image",
                    url: upload.content_uri
                },
                ...imgConfig
            }, "");

            matrixSend(config['room'].roomId, text).then(() => {
                if (strictMode) matrixSend(config['room'].roomId, "`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`");
            });
        }

        wrapper.id = config['room'].roomId;
        wrapper.sender = config['event'].event.sender;
        wrapper.platform = "matrix";
        wrapper.ping = new Date().getTime() - config['event'].event.origin_server_ts;
        wrapper.nsfw = true;
    }

    if (config['source'] === "signal") {
        wrapper.lib = "Signal.js";
        wrapper.version = require('./node_modules/@equestria.dev/signal.js/package.json').version;

        wrapper.send = (message) => {
            return new Promise((res) => {
                signalSend(config['channel'], message).then((msg) => {
                    if (strictMode) {
                        signalSend(config['channel'], "`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`").then(() => {
                            res(msg);
                        });
                    } else {
                        res(msg);
                    }
                });
            })
        }

        wrapper.image = async (buffer, imgConfig, text) => {
            signalSend(config['channel'], text, {
                attachments: [
                    new SignalAttachmentBuilder({
                        data: buffer,
                        type: imgConfig?.info?.mimetype
                    })
                ]
            }).then(() => {
                if (strictMode) signalSend(config['channel'], "`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`");
            });
        }

        wrapper.id = config['channel'].id;
        wrapper.sender = config['message'].author.number;
        wrapper.platform = "signal";
        wrapper.ping = new Date().getTime() - config['message'].createdTimestamp;
        wrapper.nsfw = true;
    }

    if (config['source'] === "discord") {
        wrapper.lib = "discord.js";
        wrapper.version = require('./node_modules/discord.js/package.json').version;

        wrapper.send = (message) => {
            config['channel'].send({
                embeds: [
                    {
                        description: message
                    }
                ]
            }).then((msg) => {
                if (strictMode) {
                    config['channel'].send("`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`").then(() => {
                        res(msg);
                    });
                } else {
                    res(msg);
                }
            });
        }

        wrapper.image = async (buffer, imgConfig, text) => {
            config['channel'].send({
                embeds: [
                    {
                        description: text,
                        image: {
                            url: "attachment://" + imgConfig.body
                        }
                    }
                ],
                files: [new AttachmentBuilder(buffer, {
                    name: imgConfig.body
                })]
            }).then(() => {
                if (strictMode) config['channel'].send("`Δt(p+s) = " + (new Date().getTime() - start) + "ms; Δt(r+p+s) = " + (wrapper.ping + (new Date().getTime() - start)) + "ms`");
            });
        }

        wrapper.id = config['channel'].id;
        wrapper.sender = config['message'].author.id;
        wrapper.platform = "discord";
        wrapper.ping = new Date().getTime() - config['message'].createdTimestamp;
        wrapper.nsfw = config['channel'].nsfw;
    }

    if (fs.existsSync("./commands/" + command + ".js")) {
        if (typeof ratelimits["month"][wrapper.sender] === "undefined") ratelimits["month"][wrapper.sender] = {};
        if (typeof ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] === "undefined") ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] = maxCredits["month"];

        if (command === "math" || command === "ask") {
            if (ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] <= 0) {
                if (config['source'] === "matrix") {
                    matrixSend(config['room'].roomId, "🚫 Sorry, you do not have any knowledge credits left, run `.usage` for more details.");
                } else if (config['source'] === "signal") {
                    signalSend(config['room'].roomId, "🚫 Sorry, you do not have any knowledge credits left, run `.usage` for more details.");
                } else if (config['source'] === "discord") {
                    config['discordSend'](config['channel'], "🚫 Sorry, you do not have any knowledge credits left for now, run `.usage` for more details.");
                }
                return;
            } else {
                ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")]--;
            }

            if (ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] < 0) ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] = 0;
        }

        require("./commands/" + command + ".js")(parameter, wrapper);
    } else if (aliases[command]) {
        if (typeof ratelimits["month"][wrapper.sender] === "undefined") ratelimits["month"][wrapper.sender] = {};
        if (typeof ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] === "undefined") ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] = maxCredits["month"];

        if (command === "math" || command === "ask") {
            if (ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] <= 0) {
                if (config['source'] === "matrix") {
                    matrixSend(config['room'].roomId, "🚫 Sorry, you do not have any knowledge credits left, run `.usage` for more details.");
                } else if (config['source'] === "signal") {
                    signalSend(config['room'].roomId, "🚫 Sorry, you do not have any knowledge credits left, run `.usage` for more details.");
                } else if (config['source'] === "discord") {
                    config['discordSend'](config['channel'], "🚫 Sorry, you do not have any knowledge credits left for now, run `.usage` for more details.");
                }
                return;
            } else {
                ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")]--;
            }

            if (ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] < 0) ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")] = 0;
        }

        require("./commands/" + aliases[command] + ".js")(parameter, wrapper);
    } else {
        if (config['source'] === "matrix") {
            matrixSend(config['room'].roomId, "🚫 `." + command + "` is not a valid command.");
        } else if (config['source'] === "signal") {
            signalSend(config['channel'], "🚫 `." + command + "` is not a valid command.");
        } else if (config['source'] === "discord") {
            config['discordSend'](config['channel'], "🚫 `." + command + "` is not a valid command.");
        }
    }
}