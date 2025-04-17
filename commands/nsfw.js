const axios = require("axios");
module.exports = async (parameter, wrapper) => {
    /*if (wrapper.sender === "@cloudburst:equestria.dev" || wrapper.sender === "@raindrops:equestria.dev" || wrapper.sender === "186730180872634368" || wrapper.sender === "493845599469174794") {
        let overage = (await axios.get("https://ponies.equestria.horse/api/overage", {
            headers: {
                'Cookie': 'PEH2_SESSION_TOKEN=' + require('../credentials.json').coldhaze
            }
        })).data;

        if (
            (wrapper.sender === "@cloudburst:equestria.dev" && !overage["cloudburst"]) ||
            (wrapper.sender === "@raindrops:equestria.dev" && !overage["raindrops"])
        ) {
            wrapper.send("⛔️ Sorry, you are not old enough to access this content.");
            return;
        }
    }*/

    if (!wrapper.nsfw) {
        wrapper.send("⛔️ Sorry, you are not allowed to use this command in this room. Try a room marked as age-restricted.");
        return;
    }

    axios.get("https://derpibooru.org/api/v1/json/search/images/?q=" + (parameter.trim() !== "" ? encodeURIComponent(parameter.trim()) + "%2C%20" : "") + "explicit%2C%20-sketch%2C%20-original%20species%2C%20-traditional%20art%2C%20-transparent%20background%2C%20-opaline%2C%20-opaline%20arcana%2C%20-princess%20cadance%2C%20-jazz%20(g5)%2C%20-queen%20haven%2C%20-smolder%2C%20-machine%20learning%20generated%2C%20-content-aware%20scale%2C%20-pony%20creator%2C%20-youtube%20caption%2C%20-forced%20meme%2C%20-fluffy%20pony%20grimdark%2C%20-grimdark%2C%20-grotesque%2C%20-obligatory%20pony%2C%20-drama%20bait%2C%20-questionable%2C%20-not%20pony%20related%2C%20-text%20only%2C%20-deviantart%20stamp%2C%20-exploitable%20meme%2C%20-nazi%2C%20-racial%20slur%2C%20-abuse%2C%20-suggestive%2C%20-1000%20hours%20in%20ms%20paint%2C%20-politics%2C%20-semi-grimdark%2C%20-seizure%20warning%2C%20-screencap%2C%20-edited%20screencap%2C%20-vulgar%2C%20-mockup%2C%20-fat%2C%20-equestria%20girls%2C%20-big%20breasts%2C%20-large%20butt%2C%20-safe%2C%20-foalcon%2C%20-human%2C%20-anthro%2C%20-rainbow%20dash%2C%20-fluttershy%2C%20-zoom%20zephyrwing%2C%20-thunder%20(g5)%2C%20-posey%2C%20-babs%20seed%2C%20-sweetie%20belle%2C%20-scootaloo%2C%20-twilight%2C%20-twilight%20sparkle%2C%20-sweetie%20bot%2C%20-thunder%2C%20-zoom%2C%20-misty%2C%20-zipp%20storm%2C%20-pipp%20petals%2C%20-penis%2C%20-licking%20cock%2C%20-dickgirl%2C%20-dicks%20everywhere%2C%20-dickboop%2C%20-dick%20in%20a%20box%2C%20-fart%20on%20dick%2C%20-dick%2C%20-flattening%2C%20-cockblock%2C%20-male%2C%20-solo%20male%2C%20-masturbation%2C%20-masturbating%20in%20stomach%2C%20-stallion%2C%20-balls%2C%20-big%20balls%2C%20-rope%2C%20-tied%20up%2C%20-ballgag%2C%20-diaper%2C%20-diaper%20fetish%2C%20-incest%2C%20-cyborg%2C%20-bondage%2C%20-apple%20bloom%2C%20-merch%20sexploitation%2C%20-fetish%2C%20-chastity%20belt%2C%20-deer%2C%20-zebra%2C%20-big%20crotchboobs%2C%20-cat%2C%20-3d%2C%20-sunny%20starscout%2C%20-izzy%20moonbow%2C%20-derpy%20hooves%2C%20-princess%20celestia%2C%20-trixie%2C%20-starlight%20glimmer%2C%20-pinkie%20pie%2C%20-applejack%2C%20-rarity%2C%20-them's%20fightin'%20herds%2C%20-pokémon%2C%20-your%20character%20here%2C%20-alcohol%2C%20-cigarette%2C%20-gmod%2C%20-meme%2C%20-gameloft%2C%20-ponified%2C%20-ych%20result%2C%20-species%20swap%2C%20-semi-incest%2C%20-barely%20pony%20related%2C%20-pixel%20art%2C%20-spanish%2C%20-japan%20ponycon%2C%20-chastity%20cage%2C%20-anal%20insertion%2C%20-semi-anthro%2C%20-big%20belly%2C%20-impossibly%20large%20belly%2C%20-huge%20belly%2C%20-belly%20bed%2C%20-glory%20hole%2C%20-selfie%2C%20-draconequus%2C%20-g1%2C%20-g2%2C%20-g3%2C%20-implied%20anon%2C%20-flurry%20heart%2C%20-silverstream%2C%20-ocellus%2C%20-yona%2C%20-gallus%2C%20-sandbar%2C%20-unikitty!%2C%20-satyr%2C%20-human%20on%20pony%20action%2C%20-latex%20pony%2C%20-intersex&sf=random&per_page=1&filter_id=56027").then((res) => {
        if (res.data['images'][0]) {
            axios.get(res.data['images'][0]['view_url'], {
                responseType: "arraybuffer"
            }).then((res2) => {
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
            wrapper.send("😢 I can't find anything explicit matching your criteria, make sure you're not using a blocked tag.");
        }
    });
}