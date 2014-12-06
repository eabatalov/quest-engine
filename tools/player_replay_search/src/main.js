var fs = require("fs");
var path = require("path");

function showHelpIfNeeded() {
    var firstArg = process.argv[2];
    if (firstArg != "-h" && firstArg != "--help"
        && firstArg != "-v" && firstArg)
        return;

    var helpTextList = [
        "Tool finds all replays with id of player passed as cmd arguments in", "\n",
        "directory passed as cmd argument.", "\n",
        "-h, --help, -v: print this help message and exit.", "\n", "\n",
        "usage: node ", process.argv[1], " path_to_dir_with_replays player_id", "\n"
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

function getPlayerId() {
    if (process.argv.length < 4) {
        console.error("Please supply player_id argument");
        process.exit(1);
    }

    var playerId = process.argv[3];
    return playerId;
}

function main() {
    showHelpIfNeeded();
    var replaysDirPath = getReplayDirPath();
    var playerId = getPlayerId();
    console.log("Processing directory: ", replaysDirPath);

    var replayFilePaths = getReplayFilePaths(replaysDirPath);
    var replayFileInfos = jQuery.map(replayFilePaths, createReplayFileInfo);
    var replayFilter = new PlayerIdSearchFilter(playerId);
    replayFileInfos = jQuery.grep(replayFileInfos, function(replayFileInfo) {
        return replayFileInfo !== null &&
            replayFilter.pass(replayFileInfo);
    });

    printLevelReplayFileInfos(replayFileInfos);

    //console.log("Processing is finished");
}

main();
