var fs = require("fs");
var path = require("path");

function showHelpIfNeeded() {
    var firstArg = process.argv[2];
    if (firstArg != "-h" && firstArg != "--help"
        && firstArg != "-v" && firstArg)
        return;

    var helpTextList = [
        "Tool (ver: game2) provides simple replay analytics and filtering facilities.", "\n",
        "-h, --help, -v: print this help message and exit.", "\n", "\n",
        "usage: node ", process.argv[1], " path_to_dir_with_replays [arguments]", "\n", "\n",
        "Replay filtering arguments:", "\n",
        ReplayFileInfoFilter.getArgvHelp()
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
    var replayFilter = new ReplayFileInfoFilter(process.argv.slice(3));
    replayFileInfos = jQuery.grep(replayFileInfos, function(replayFileInfo) {
        return replayFileInfo !== null &&
            replayFilter.isReplayFileInfoOk(replayFileInfo);
    });

    printLevelReplayFileInfos(replayFileInfos);

    //console.log("Processing is finished");
}

main();
