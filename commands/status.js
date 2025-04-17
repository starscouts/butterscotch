const axios = require("axios");

module.exports = (parameter, wrapper) => {
    axios.get("https://status.equestria.dev/status.json").then((res) => {
        let text = "";

        switch (res.data.code) {
            case 0:
                text += "✅ Everything is running smoothly";
                break;

            case 1:
                text += "⚠️ Some minor issues have been detected";
                break;

            case 2:
                text += "🚨️ One or more services are unavailable";
                break;
        }

        if (res.data.code !== 0) {
            text += "\n" + res.data['outages'].map(i => "* " + i[0] + " > **" + i[1] + "**").join("\n");
        }

        text += "\n\n[Open status page](https://status.equestria.dev)";

        wrapper.send(text);
    });
}