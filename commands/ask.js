const axios = require('axios');

module.exports = (parameter, wrapper) => {
    /*axios.get("https://api.wolframalpha.com/v1/result?i=" + encodeURIComponent(parameter) + "&appid=" + require('../credentials.json').wolfram).then((res) => {
        send(room.roomId, "🔎 " + res.data);
    });*/

    /*axios.get("https://api.wolframalpha.com/v1/conversation.jsp?appid=" + require('../credentials.json').wolfram + "&i=" + encodeURIComponent(parameter)).then((res) => {
        if (res.data.result) {
            send(room.roomId, "🔎 " + res.data.result);
        } else {
            send(room.roomId, "😢 Sorry, no response was found to your query, try again later.");
        }
    });*/

    try {
        axios.get("https://api.wolframalpha.com/v1/spoken?i=" + encodeURIComponent(parameter) + "&appid=" + require('../credentials.json').wolfram).then((res) => {
            wrapper.send("🔎 " + res.data);
        }).catch((e) => {
            wrapper.send("😢 Sorry, no response was found to your query, try again later.");
        });
    } catch (e) {
        wrapper.send("😢 Sorry, no response was found to your query, try again later.");
    }
}