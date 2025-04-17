module.exports = (parameter, wrapper) => {
    if (!require('../credentials.json').admins.includes(wrapper.sender)) {
        wrapper.send("⛔️ This command is private and you are not allowed to use it.");
        return;
    }

    wrapper.send("🔁 The bot is now restarting, please wait until it is back up.").then(() => {
        process.exit(158);
    });
}