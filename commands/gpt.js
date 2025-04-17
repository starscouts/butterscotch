const axios = require('axios');
const fs = require("fs");

module.exports = (parameter, wrapper) => {
    if (!require('../credentials.json').admins.includes(wrapper.sender)) {
        wrapper.send("⛔️ This command is private and you are not allowed to use it.");
        return;
    }

    try {
        axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: parameter
                }
            ],
            max_tokens: 500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + require('../credentials.json').chatgpt
            }
        }).then((res) => {
            wrapper.send("🤖 " + res.data['choices'][0]['message']['content']);
        }).catch((e) => {
            wrapper.send("🚨 Sorry, an error occurred on our side, try again later.");
        });
    } catch (e) {
        wrapper.send("🚨 Sorry, an error occurred on our side, try again later.");
    }
}