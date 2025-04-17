module.exports = (parameter, wrapper) => {
    let usedCredits = {
        month:ratelimits["month"][wrapper.sender][new Date().toISOString().split("-").splice(0, 2).join("-")]
    }

    wrapper.send("🛑 More expensive commands have a monthly credit system to prevent abuse and to make sure everyone gets a fair share at trying out the bot. These credits are reset every month on the 1st.\n\n\n" +
        "* **Knowledge credits:** " + usedCredits["month"] + "/" + maxCredits["month"] + " (" + Math.round(((maxCredits["month"] - usedCredits["month"]) / maxCredits["month"]) * 100) + "% used)");
}