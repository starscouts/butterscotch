const axios = require("axios");
const dns = require("dns").promises;
const util = require("util");
let regions = new Intl.DisplayNames(['en'], {type: 'region'});

module.exports = async (parameter, wrapper) => {
    let equestriaDev = [
        ...(await dns.resolve4("bridlewood.equestria.dev")),
        ...(await dns.resolve4("zephyrheights.equestria.dev")),
        ...(await dns.resolve4("manehattan.equestria.dev")),
        ...(await dns.resolve4("cloudsdale.equestria.dev")),
        ...(await dns.resolve4("everfree.equestria.dev")),
        ...(await dns.resolve4("maretimebay.equestria.dev")),
    ]

    if (parameter.trim() === "") {
        wrapper.send("⚡️ Please specify an IP address to look up.");
    } else {
        axios.get("https://api.iplocation.net/?ip=" + parameter.trim()).then((res) => {
            if (res.data['response_message'] === "OK") {
                try {
                    wrapper.send("ℹ️ `" + res.data['ip'] + "` (IPv" + res.data['ip_version'] + ")"
                        + "\n\n* **ISP:** " + (res.data['isp'] ? res.data['isp'] + (equestriaDev.includes(res.data['ip']) ? " for Equestria.dev" : "") : "-")
                        + "\n* **Country:** " + regions.of(res.data['country_code2']) + " (" + res.data['country_code2'] + ")"
                    );
                } catch (e) {
                    wrapper.send("> `" + res.data['ip'] + "` (IPv" + res.data['ip_version'] + ")"
                        + "\n\n* **ISP:** " + (res.data['isp'] ? res.data['isp'] + (equestriaDev.includes(res.data['ip']) ? " for Equestria.dev" : "") : "-")
                        + "\n* **Country:** -"
                    );
                }
            } else {
                wrapper.send("😢 Sorry, something didn't go as expected.");
            }
        });
    }
}