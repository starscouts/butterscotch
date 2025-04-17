const fs = require("fs");

let final = "";

for (let file of fs.readdirSync("./source")) {
    let text = fs.readFileSync("./source/" + file).toString();
    let lines = text.split("\n").filter(i => i.startsWith(":'''")).map(i => i.split(":'''")[1].split("''': ")).filter(i => i.length === 2).map(i => { i[1] = i[1].replace(/\[[^\]]*]/g, "").replace(/<!--[^>]*-->/g, "").trim().replace(/ +/g, " ").replaceAll("'''", "").replaceAll("''", ""); return i; }).filter(i => (
        i[0] === "Twilight Sparkle" ||
        i[0] === "Rainbow Dash" ||
        i[0] === "Applejack" ||
        i[0] === "Rarity" ||
        i[0] === "Pinkie Pie" ||
        i[0] === "Spike" ||
        i[0] === "Fluttershy" ||
        i[0] === "Princess Celestia" ||
        i[0] === "Princess Luna" ||
        i[0] === "Princess Cadance" ||
        i[0] === "Starlight Glimmer" ||
        i[0] === "Sunny Starscout" ||
        i[0] === "Izzy Moonbow" ||
        i[0] === "Hitch Trailblazer" ||
        i[0] === "Zipp Storm" ||
        i[0] === "Argyle Starshine" ||
        i[0] === "Young Hitch Trailblazer" ||
        i[0] === "Young Sunny Starscout" ||
        i[0] === "Pipp Petals"
    )).filter(i => i[1] !== "").map(i => i[1] + " — " + i[0]);

    console.log(lines);
    final += lines.join("\n");
}

fs.writeFileSync("./fortunes.txt", final);