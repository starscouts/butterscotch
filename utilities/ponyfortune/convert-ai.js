const fs = require("fs");
const {add} = require("nodemon/lib/rules");

let final = [];

let text = fs.readFileSync("./source/training-full.txt").toString();
let lines = text.split("\n").filter(i => i.startsWith(":'''")).map(i => i.split(":'''")[1].split("''': ")).filter(i => i.length === 2).map(i => { i[1] = i[1].replace(/\[[^\]]*]/g, "").replace(/<!--[^>]*-->/g, "").trim().replace(/ +/g, " ").replaceAll("'''", "").replaceAll("''", ""); return i; }).filter(i => i[1] !== "").map(i => i[0] + ": " + i[1]);

console.log(lines);

let current = {
    input: null,
    output: null
}

for (let line of lines) {
    let author = line.split(": ")[0];

    if (author === "Twilight Sparkle") {
        current.input = line;
    } else if (author !== "Twilight Sparkle" && current.input) {
        current.output = line;
    }

    if (current.input && current.output) {
        final.push(current);

        current = {
            input: null,
            output: null
        }
    }
}

fs.writeFileSync("./script.json", JSON.stringify(final, null, 2));
console.log(final.length);