const vm = require('vm');

module.exports = (parameter, wrapper) => {
    let start = new Date();

    function userToUUID(user) {
        const crypto = require('crypto');
        let hash = crypto.createHash("sha1").update(user).digest("hex");
        return hash.substring(0, 8) + "-" + hash.substring(8, 12) + "-4" + hash.substring(12, 15) + "-8" + hash.substring(15, 18) + "-" + hash.substring(18, 30);
    }

    let id = userToUUID(wrapper.sender);

    try {
        if (!evalContexts[id]) {
            evalContexts[id] = {};
            vm.createContext(evalContexts[id]);
        }

        try {
            let ret = vm.runInContext(parameter, evalContexts[id]);

            try {
                wrapper.send("✅ Completed in " + (new Date().getTime() - start) + " ms, running in `isolated:" + id + "` context\n\n```plaintext\n" + JSON.stringify(ret, null, 2) + "\n```");
            } catch (e) {
                wrapper.send("⚠️ Completed with invalid JSON in " + (new Date().getTime() - start) + " ms, running in `isolated:" + id + "` context\n\n```plaintext\n" + ret + "\n```");
            }
        } catch (e) {
            wrapper.send("🚨 Failed after " + (new Date().getTime() - start) + " ms, running in `isolated:" + id + "` context\n\n```plaintext\n" + e.stack + "\n```");
        }
    } catch (e) {
        wrapper.send("⛔️ Failed to initialise context `isolated:" + id + "`:\n\n```plaintext\n" + e.stack + "\n```");
    }
}