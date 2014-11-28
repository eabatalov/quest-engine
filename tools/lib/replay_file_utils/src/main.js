function getReplayFilePaths(replaysDirPath) {
    var fs = require("fs");
    var path = require("path");

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
    var fs = require("fs");
    var path = require("path");
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

function deleteReplayFileInfo(replayFileInfo) {
    var fs = require("fs");
    fs.unlinkSync(replayFileInfo.getFilePath());
}

function deleteReplayFileInfos(infos) {
    jQuery.each(infos, function(ix, info) {
        deleteReplayFileInfo(info);
    });
}
