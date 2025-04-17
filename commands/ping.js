module.exports = (parameter, wrapper) => {
    wrapper.send("🚀 Pong! It took me " + wrapper.ping + " ms to reply to this.");
}