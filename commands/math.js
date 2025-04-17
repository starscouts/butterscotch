const axios = require('axios');

module.exports = (parameter, wrapper) => {
    try {
        axios.get("https://api.wolframalpha.com/v2/query?input=" + encodeURIComponent(parameter) + "&output=json&appid=" + require('../credentials.json').wolfram).then((res) => {
            let result = res.data.queryresult;

            if (result.success) {
                console.log(result.pods.map(i => i.subpods));

                if (result.pods.filter(i => i.subpods.filter(j => j.plaintext.trim() !== "")).length === 1) {
                    wrapper.send("♾️ Here is the solution to your problem: " + result.pods.filter(i => i.subpods.filter(j => j.plaintext.trim() !== "").length > 0).map(i => " (" + i.title + ") " + i.subpods.filter(j => j.plaintext.trim() !== "").map(i => "`" + i.plaintext + "`").join("; ")).join("\n"));
                } else if (result.pods.filter(i => i.subpods.filter(j => j.plaintext.trim() !== "")).length > 1) {
                    wrapper.send("♾️ Here are the solutions to your problem:\n\n" + result.pods.filter(i => i.subpods.filter(j => j.plaintext.trim() !== "").length > 0).map(i => "* **" + i.title + ":** " + i.subpods.filter(j => j.plaintext.trim() !== "").map(i => (i.title.trim() !== "" ? i.title + ": " : "") + "`" + i.plaintext + "`").join("; ")).join("\n"));
                } else {
                    wrapper.send("🤔 While I understand your problem, I can't solve it, sorry.");
                }
            } else {
                wrapper.send("😢 Sorry, I can't quite solve this problem, try again later.");
            }
        }).catch((e) => {
            wrapper.send("😢 Sorry, I can't quite solve this problem, try again later.");
        });
    } catch (e) {
        wrapper.send("😢 Sorry, I can't quite solve this problem, try again later.");
    }
}