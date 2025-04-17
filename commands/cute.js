const axios = require("axios");
module.exports = (parameter, wrapper) => {
    axios.get("https://derpibooru.org/api/v1/json/search/images/?q=" + (parameter.trim() !== "" ? encodeURIComponent(parameter.trim()) + ",%20" : "") + "cute,%20-bipedal,%20-human,%20-anthro,%20-face%20mask%20-text,%20-machine%20learning%20generated,%20-comic:pipp%27s%20ponyfans%20adventure,%20-content-aware%20scale,%20-pony%20creator,%20-youtube%20caption,%20-forced%20meme,%20-fluffy%20pony%20grimdark,%20-grimdark,%20-grotesque,%20-obligatory%20pony,%20-drama%20bait,%20-questionable,%20-not%20pony%20related,%20-text%20only,%20-deviantart%20stamp,%20-explicit,%20-exploitable%20meme,%20-nazi,%20-racial%20slur,%20-abuse,%20-suggestive,%20-1000%20hours%20in%20ms%20paint,%20-politics,%20-semi-grimdark,%20-seizure%20warning,%20-screencap,%20-edited%20screencap,%20-vulgar,%20-mockup,%20-fat,%20-sexy,%20-equestria%20girls,%20-big%20breasts,%20-large%20butt,%20-butt,%20-scootadash,%20-pregnant,%20-belly,%20-fetish,%20-drugs,%20-animated,%20-webm,%20-hoof%20knuckles,%20-your%20character%20here,%20-alcohol,%20-cigarette,%20-gmod,%20-them%27s%20fightin%27%20herds,%20-meme,%20-gameloft,%20-ponified,%20-ych%20result,%20-species%20swap,%20-semi-incest,%20-barely%20pony%20related,%20-pixel%20art,%20-spanish,%20-oc,%20-japan%20ponycon,%20-semi-anthro,%20-big%20belly,%20-impossibly%20large%20belly,%20-huge%20belly,%20-pokémon,%20-discord,%20-belly%20bed,%20-glory%20hole,%20-selfie,%20-g1,%20-g2,%20-g3,%20-implied%20anon&sf=random&per_page=1&filter_id=56027").then((res) => {
        if (res.data['images'][0]) {
            axios.get(res.data['images'][0]['view_url'], {
                responseType: "arraybuffer"
            }).then(async (res2) => {
                wrapper.image(res2.data, {
                    body: res.data['images'][0]['name'],
                    info: {
                        mimetype: res.data['images'][0]['mime_type'],
                        w: res.data['images'][0]['width'],
                        h: res.data['images'][0]['height'],
                        size: res.data['images'][0]['size']
                    }
                }, "[View image on Derpibooru](https://derpibooru.org/images/" + res.data['images'][0]['id'] + ")");
            })
        } else {
            wrapper.send("😢 I can't find anything cute matching your criteria, make sure you're not using a blocked tag.");
        }
    });
}