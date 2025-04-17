const axios = require("axios");
const {isNumber} = require("matrix-js-sdk/lib/utils");

module.exports = (parameter, wrapper) => {
    if (!require('../credentials.json').moderators.includes(wrapper.sender)) {
        wrapper.send("⛔️ This command is private and you are not allowed to use it.");
        return;
    }

    wrapper.send("Your marefriend loves you cutie! ❤️");
}