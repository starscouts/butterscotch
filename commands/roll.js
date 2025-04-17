const axios = require('axios');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findMedian(data) {
    let m = data.sort(function(a, b) {
        return a - b;
    });

    let middle = Math.floor((m.length - 1) / 2);

    if (m.length % 2) {
        return m[middle];
    } else {
        return (m[middle] + m[middle + 1]) / 2.0;
    }
}

module.exports = (parameter, wrapper) => {
    let data = parameter.trim().replace(/^(\d*)d(\d+)$/gm, "$1|$2");

    if (data === parameter.trim()) {
        wrapper.send("⛔️ Invalid syntax, use `(X)dY` where `X` is the amount of dices and `Y` is the maximum number (starting from 1).");
        return;
    }

    let amount = parseInt(data.split("|")[0]);
    let max = parseInt(data.split("|")[1]);

    if (isNaN(amount)) amount = 1;
    if (isNaN(max)) max = 6;

    if (amount < 1 || amount > 1000) {
        wrapper.send("⛔️ The amount of dices must be between 1 and 1000.");
        return;
    }

    if (max <= 1 || max > Number.MAX_SAFE_INTEGER) {
        wrapper.send("⛔️ The maximum number must be between 1 and " + Number.MAX_SAFE_INTEGER + ".");
        return;
    }

    let text = "🎲 ";
    let rolls = [];

    if (amount > 1) {
        text += "Rolling " + amount + " dices between 1 and " + max + "\n\n";
    } else {
        text += "Rolling a dice between 1 and " + max + ": ";
    }

    for (let i = 0; i < amount; i++) {
        rolls.push(getRandomInt(1, max));
    }

    text += rolls.map(i => "`" + i + "`").join(", ");

    if (amount > 1) {
        text += (wrapper.platform === "matrix" ? "<br>" : "\n") + "Total `" + rolls.reduce((a, b) => a + b) + "`, Average `" + (rolls.reduce((a, b) => a + b) / rolls.length).toFixed(3) + "`, Median `" + findMedian(rolls) + "`, Extent `" + (Math.max(...rolls) - Math.min(...rolls)) + "`"
    }

    wrapper.send(text);
}