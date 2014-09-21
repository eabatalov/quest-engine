var fs = require("fs");
var path = require("path");

function showHelpIfNeeded() {
    var firstArg = process.argv[2];
    if (firstArg != "-h" && firstArg != "--help"
        && firstArg != "-v" && firstArg)
        return;

    var helpTextList = [
        "Tool provides simple replay analytics and filtering fascilities.", "\n",
        "usage: node main.js path_to_dir_with_replays arguments", "\n", "\n",
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

function getReplayFilePaths(replaysDirPath) {
    var replaysDirFiles = fs.readdirSync(replaysDirPath);
    var replaysDirReplayFiles = jQuery.grep(replaysDirFiles, function(fileName) {
        return fileName.indexOf("replay_") === 0;
    });

    var replaysDirReplayFilePaths =
        jQuery.map(replaysDirReplayFiles, function(replaysDirReplayFileName) {
            return path.join(replaysDirPath, replaysDirReplayFileName);
        });

    return replaysDirReplayFilePaths;
}

function createReplayFileInfo(replayFilePath) {
    //console.log("Loading replay from: ", replayFilePath);
    var replaySavedStr = fs.readFileSync(replayFilePath, { encoding : "utf8" });
    var replaySaved = JSONSafeParse(replaySavedStr);
    if (replaySaved === null) {
        console.error("Replay file ", replayFilePath, "is corrupted");
        return null;
    }
    var replay = LevelReplay.load(replaySaved);
    var replayAnalytics = new LevelReplayAnalytics(replay);
    return new ReplayFileInfo(replayFilePath, replay, replayAnalytics);
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
