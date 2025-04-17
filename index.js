const fs = require("fs");
const path = require('path');

const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (file === "cache") return;

        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
        }
    });

    return arrayOfFiles
}

let files = getAllFiles(".");
let sums = [];

process.versions.butterscotch = new Date().getTime().toString();

if (!fs.existsSync("cache")) fs.mkdirSync("cache");
if (!fs.existsSync("cache/lastMessages.json")) fs.writeFileSync("cache/lastMessages.json", "{}");
if (!fs.existsSync("cache/ratelimits.json")) fs.writeFileSync("cache/ratelimits.json", `{"month":{},"day":{},"hour":{},"minute":{}}`);
if (!fs.existsSync("cache/score.json")) fs.writeFileSync("cache/score.json", `{"history":{},"score":0,"percentage":0}`);

try {
    global.lastMessages = JSON.parse(fs.readFileSync("cache/lastMessages.json").toString());
} catch (e) {
    fs.writeFileSync("cache/lastMessages.json", "{}");
    global.lastMessages = JSON.parse(fs.readFileSync("cache/lastMessages.json").toString());
}

global.aliases = {};
global.evalContexts = {};

process.on('uncaughtException', (e) => {
    console.error(e);
});

try {
    global.ratelimits = JSON.parse(fs.readFileSync("cache/ratelimits.json").toString());
} catch (e) {
    fs.writeFileSync("cache/ratelimits.json", "{\"month\":{},\"day\":{},\"hour\":{},\"minute\":{}}");
    global.ratelimits = JSON.parse(fs.readFileSync("cache/ratelimits.json").toString());
}

let lastSavedLastMessages = JSON.stringify(lastMessages);
let lastSavedRateLimits = JSON.stringify(ratelimits);

global.maxCredits = {
    month: 400
}

setInterval(() => {
    if (JSON.stringify(ratelimits) !== lastSavedRateLimits) {
        console.log("Saving ratelimits");
        fs.writeFileSync("cache/ratelimits.json", JSON.stringify(ratelimits));
        lastSavedRateLimits = JSON.stringify(ratelimits);
    }

    if (JSON.stringify(lastMessages) !== lastSavedLastMessages) {
        console.log("Saving lastMessages");
        fs.writeFileSync("cache/lastMessages.json", JSON.stringify(lastMessages));
        lastSavedLastMessages = JSON.stringify(lastMessages);
    }
}, 1000);

for (let helpFile of fs.readdirSync("./help")) {
    let command = helpFile.substring(0, helpFile.length - 5);
    let help = JSON.parse(fs.readFileSync("./help/" + helpFile).toString());

    if (help['aliases']) {
        for (let alias of help['aliases']) {
            aliases[alias] = command;
        }
    }
}

//require('./matrix');
require('./discord');
require('./signal');