var fs = require("fs");
var path = require("path");

function showHelpIfNeeded() {
    var firstArg = process.argv[2];
    if (firstArg != "-h" && firstArg != "--help"
        && firstArg != "-v" && firstArg)
        return;

    var helpTextList = [
        "Tool deletes 'useless' replays:", "\n",
        "- Without tid", "\n",
        "- Play duration < 2 sec", "\n",
        "- With localhost hostname", "\n",
        "- With 127.0.0.1 hostname", "\n",
        "-h, --help, -v: print this help message and exit.", "\n", "\n",
        "usage: node ", process.argv[1], " path_to_dir_with_replays ", "\n"
    ];
    console.log(helpTextList.join(""));
    process.exit(1);
}

function getReplayDirPath() {
    if (process.argv.length < 3) {
        console.error("Please supply path to directory with level replays");
        process.exit(1);
    }

    var replaysDirPath = process.argv[2];

    var replaysDirPathStats = fs.statSync(replaysDirPath);
    if (!replaysDirPathStats.isDirectory()) {
        console.error(replaysDirPath, "is not a directory");
        process.exit(1);
    }

    return replaysDirPath;
}

function main() {
    showHelpIfNeeded();
    var replaysDirPath = getReplayDirPath();
    console.log("Processing directory: ", replaysDirPath);

    var replayFilePaths = getReplayFilePaths(replaysDirPath);
    var replayFileInfos = jQuery.map(replayFilePaths, createReplayFileInfo);
    replayFileInfosToDelete =
        jQuery.grep(replayFileInfos, function(replayFileInfo) {
            function logDelete(reason) {
                console.warn("Deleting: ",
                    path.basename(replayFileInfo.getFilePath()), "\n",
                    "Reason: ", reason, "\n"
                    );
                return true;
            }
            if (replayFileInfo === null)
                return false;
            if (replayFileInfo.getReplayAnalytics().getTesterId() === "")
                return logDelete("empty tid");
            if (replayFileInfo.getReplayAnalytics().getReplayDurationMS() < 2000)
                return logDelete("duration < 2 sec");
            if (replayFileInfo.getReplay().getReplayInfo().getHostName() === "localhost")
                return logDelete("hostname == localhost");
            if (replayFileInfo.getReplay().getReplayInfo().getHostName() === "127.0.0.1")
                return logDelete("hostName == 127.0.0.1");
            return false;
    });

    deleteReplayFileInfos(replayFileInfosToDelete); 
    //console.log("Processing is finished");
}

main();
