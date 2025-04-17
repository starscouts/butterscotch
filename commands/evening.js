const axios = require("axios");
const {isNumber} = require("matrix-js-sdk/lib/utils");

module.exports = (parameter, wrapper) => {
    if (!require('../credentials.json').moderators.includes(wrapper.sender)) {
        wrapper.send("⛔️ This command is private and you are not allowed to use it.");
        return;
    }

    let selectedDay;

    if (parameter && !isNaN(parseInt(parameter)) && parameter > -1 && parameter < 7) {
        selectedDay = parseInt(parameter);
    }

    /*

    [ - Will be 'null' if the day has been ignored
        [
            string[] - Full names of the members of Cloudburst fronting today
            string[] - Full names of the members of Raindrops fronting today
        ],
        [
            string[] - Full names of the members of Cloudburst fronting tomorrow
            string[] - Full names of the members of Raindrops fronting tomorrow
        ]
    ]

     */

    axios.get("https://ponies.equestria.horse/api/evening", {
        headers: {
            'Cookie': 'PEH2_SESSION_TOKEN=' + require('../credentials.json').coldhaze
        }
    }).then(res => {
        let data = res.data;
        let text = "";

        function appendDay(day, name, mini) {
            if (!mini) text += "\n* <u>" + name + ":</u> ";

            if (data[day]) {
                let locked = false;

                if (data[day][0].map(i => i.endsWith("*")).includes(true)) {
                    locked = true;
                    text += " **" + data[day][0].map(i => i.substring(0, i.length - 1)).join("** and **") + "** with";
                } else {
                    text += " **" + data[day][0].join("** and **") + "** with";
                }

                if (data[day][1].map(i => i.endsWith("*")).includes(true)) {
                    locked = true;
                    text += " **" + data[day][1].map(i => i.substring(0, i.length - 1)).join("** and **") + "**";
                } else {
                    text += " **" + data[day][1].join("** and **") + "**";
                }

                if (locked) {
                    text += " *(locked)*";
                }
            } else {
                text += "*(marked as ignored)*";
            }
        }

        if (selectedDay) {
            text = "🌙 Here is what is scheduled for " + (selectedDay === 0 ? "tonight" : (selectedDay === 1 ? "tomorrow" : "the " + new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * selectedDay))))) + ":";

            appendDay(selectedDay, "", true);
        } else {
            text = "🌙 Here is what is scheduled for the next nights:\n";

            appendDay(0, "Tonight");
            appendDay(1, "Tomorrow");
            appendDay(2, new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * 2))));
            appendDay(3, new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * 3))));
            appendDay(4, new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * 4))));
            appendDay(5, new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * 5))));
            appendDay(6, new Intl.DateTimeFormat('en-IE', { weekday: "long", day: "numeric" }).format(new Date(new Date().getTime() + (86400000 * 6))));
        }

        text += "\n\n[View on Cold Haze](https://ponies.equestria.horse/-/evening)";

        wrapper.send(text);
    });
}