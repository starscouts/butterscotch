const child_process = require("child_process");
const {readFileSync} = require("fs");

let list = readFileSync("./utilities/ponyfortune/fortunes.txt").toString().trim().split("\n");

module.exports = (parameter, wrapper) => {
    let candidates = list;

    if (parameter.trim() !== "") {
        candidates = candidates.filter(i => i.toLowerCase().replace(/[^a-z]/g, "").trim().includes(parameter.toLowerCase().replace(/[^a-z]/g, "").trim()));
    }

    if (candidates.length > 0) {
        wrapper.send("🦄 " + candidates[Math.floor(Math.random() * candidates.length)]);
    } else {
        wrapper.send("⛔️ I can't find anything matching what you asked for");
    }
}