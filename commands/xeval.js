const child_process = require("child_process");
const {promisify} = require("util");

module.exports = async (parameter, wrapper) => {
    let start = new Date();
    let exec = promisify(child_process.exec);

    if (require('../credentials.json').admins.includes(wrapper.sender)) {
        try {
            let ret = await exec(parameter);

            wrapper.send("✅ Completed in " + (new Date().getTime() - start) + " ms, running in `system` context\n\n```plaintext\n" + ret.stdout + "\n```\n```plaintext\n" + ret.stderr + "\n```");
        } catch (e) {
            wrapper.send("🚨 Failed after " + (new Date().getTime() - start) + " ms, running in `system` context\n\n```plaintext\n" + e.stdout + "\n```\n```plaintext\n" + e.stderr + "\n```");
        }
    } else {
        wrapper.send("⛔️ This command is private and you are not allowed to use it. Try `.eval` instead.");
    }
}