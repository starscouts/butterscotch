const axios = require('axios');

module.exports = (parameter, wrapper) => {
    wrapper.send(`
**Platform:** \`${wrapper.platform}\`
**${wrapper.lib} version:** \`${wrapper.version}\`
**Build ID:** \`${process.versions.butterscotch}\`
**Channel ID:** \`${wrapper.id}\`
**Sender ID:** \`${wrapper.sender}\`
**Ping:** \`${wrapper.ping}\`
**NSFW:** \`${wrapper.nsfw ? 'true' : 'false'}\`
`);
}