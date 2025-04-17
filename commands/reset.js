const vm = require('vm');

module.exports = (parameter, wrapper) => {
    let start = new Date();

    function userToUUID(user) {
        const crypto = require('crypto');
        let hash = crypto.createHash("sha1").update(user).digest("hex");
        return hash.substring(0, 8) + "-" + hash.substring(8, 12) + "-4" + hash.substring(12, 15) + "-8" + hash.substring(15, 18) + "-" + hash.substring(18, 30);
    }

    let id = userToUUID(wrapper.sender);

    if (evalContexts[id]) {
        delete evalContexts[id];
        wrapper.send("✅ Successfully unliked context `isolated:" + id + "`.");
    } else {
        wrapper.send("⛔️ Cannot unlink context `isolated:" + id + "` as it is not currently linked.");
    }
}