const os = require("os");

module.exports = (parameter, wrapper) => {
    function prettySize(size) {
        if (size < 1024) {
            return size + " bytes";
        } else if (size < 1024**2) {
            return (size / 1024).toFixed(2) + " KiB";
        } else if (size < 1024**3) {
            return (size / 1024**2).toFixed(2) + " MiB";
        } else if (size < 1024**4) {
            return (size / 1024**3).toFixed(2) + " GiB";
        }
    }

    function getPercentage(used, total) {
        return (used / total) * 100;
    }

    let percentage = getPercentage(os.totalmem() - os.freemem(), os.totalmem());
    let bars = Math.round(percentage / 4);
    let percentage2 = getPercentage(process.memoryUsage().heapUsed, process.memoryUsage().heapTotal);
    let bars2 = Math.round(percentage2 / 4);

    wrapper.send("💻 Here is how much RAM this bot is using:\n\n#### General\n" +
        "\n* **System:** " + prettySize(os.totalmem() - os.freemem()) + "/" + prettySize(os.totalmem()) + "\n<br>`[" + "=".repeat(bars) + " ".repeat(25 - bars) + "]`" +
        "\n* **Process:** " + prettySize(process.memoryUsage().heapUsed) + "/" + prettySize(process.memoryUsage().heapTotal) + "\n<br>`[" + "=".repeat(bars2) + " ".repeat(25 - bars2) + "]`" +
        "\n\n#### Advanced" +
        "\n* **Resident set size:** " + prettySize(process.memoryUsage().rss) +
        "\n* **Binary buffers:** " + prettySize(process.memoryUsage().arrayBuffers) +
        "\n* **C++ objects:** " + prettySize(process.memoryUsage().external)
    );
}