module.exports = (parameter, wrapper) => {
    if (!require('../credentials.json').admins.includes(wrapper.sender)) {
        wrapper.send("⛔️ This command is private and you are not allowed to use it.");
        return;
    }

    wrapper.send("[💣](https://admin.equestria.dev/#v1:0:=lxc%2F211:4::::::=consolejs:)").then(() => {
        process.exit(2);
    });
}