module.exports = (parameter, wrapper) => {
    let start = new Date();

    if (require('../credentials.json').admins.includes(wrapper.sender)) {
        try {
            let ret = eval(parameter);

            try {
                wrapper.send("✅ Completed in " + (new Date().getTime() - start) + " ms, running in `main` context\n\n```plaintext\n" + JSON.stringify(ret, null, 2) + "\n```");
            } catch (e) {
                wrapper.send("⚠️ Completed with invalid JSON in " + (new Date().getTime() - start) + " ms, running in `main` context\n\n```plaintext\n" + ret + "\n```");
            }
        } catch (e) {
            wrapper.send("🚨 Failed after " + (new Date().getTime() - start) + " ms, running in `main` context\n\n```plaintext\n" + e.stack + "\n```");
        }
    } else {
        wrapper.send("⛔️ This command is private and you are not allowed to use it. Try `.eval` instead.");
    }
}