var fs = require("fs");
var path = require("path");

function showHelpIfNeeded() {
    var firstArg = process.argv[2];
    if (firstArg != "-h" && firstArg != "--help"
        && firstArg != "-v" && firstArg)
        return;

    var helpTextList = [
        "Tool finds all replays that contain custom record of type passed as cmd argument", "\n",
        "in directory passed as cmd argument.", "\n",
        "-h, --help, -v: print this help message and exit.", "\n", "\n",
        "usage: node ", process.argv[1], " path_to_dir_with_replays custom_record_type", "\n"
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

function getCustomRecType() {
    if (process.argv.length < 4) {
        console.error("Please supply custom_record_type argument");
        process.exit(1);
    }

    var customRecType = process.argv[3];
    return customRecType;
}

function main() {
    showHelpIfNeeded();
    var replaysDirPath = getReplayDirPath();
    var customRecType = getCustomRecType();
    console.log("Processing directory: ", replaysDirPath);

    var replayFilePaths = getReplayFilePaths(replaysDirPath);
    var replayFileInfos = jQuery.map(replayFilePaths, createReplayFileInfo);
    var replayFilter = new CustomRecordSearchFilter(customRecType);
    jQuery.each(replayFileInfos, function(ix, replayFileInfo) {
        return replayFileInfo !== null &&
            replayFilter.process(replayFileInfo);
    });
    //console.log("Processing is finished");
}

main();
