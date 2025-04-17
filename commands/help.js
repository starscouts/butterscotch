const fs = require("fs");

module.exports = (parameter, wrapper) => {
    if (parameter.trim() !== "") {
        if (fs.existsSync("./help/" + parameter.replaceAll("/", "-").replaceAll("_", "-") + ".json")) {
            let help = JSON.parse(fs.readFileSync("./help/" + parameter + ".json").toString());
            let txt = "ℹ️ `." + parameter + help['parameters'] + "`\n";

            if (help['aliases'] && help['aliases'].length > 0) {
                txt += "* **Alias" + (help['aliases'].length > 1 ? "es" : "") + ":** " + help['aliases'].map(i => `\`.${i}\``).join(", ") + "\n";
            }

            if (help['description'] && help['description'].trim() !== "") {
                txt += "* **Description:** " + help['description'] + "\n";
            }

            if (parameter === "ask" || parameter === "math") {
                txt += "* Limited to 400 commands a month\n";
            }

            wrapper.send(txt);
        } else {
            wrapper.send("😢 Sorry, no help is available for this command, try again later.");
        }
    } else {
        let list = "";
        let categories = JSON.parse(fs.readFileSync("./help/_categories.json").toString());
        let commands = fs.readdirSync("./commands");

        for (let category of Object.keys(categories)) {
            list += "* **" + category + ":** ";
            let categoryCommands = [];

            for (let command of commands) {
                if (categories[category].includes(command.substring(0, command.length - 3))) {
                    categoryCommands.push("`." + command.substring(0, command.length - 3) + "`");
                    commands = commands.filter(i => i !== command);
                }
            }

            list += categoryCommands.join(", ") + "\n";
        }

        if (commands.length > 0) {
            list += "* **Other:** ";
            let categoryCommands = [];

            for (let command of commands) {
                categoryCommands.push("`." + command.substring(0, command.length - 3) + "`");
            }

            list += categoryCommands.join(", ") + "\n";
        }

        wrapper.send("👋 Hey! Here are all the commands you can use:\n" + list + "\nUse `.help [command]` to get help for a specific command.");
    }
}