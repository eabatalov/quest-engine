function ReplayFileInfo(filePath, replay, replayAnalytics)
{
    this.filePath = filePath;
    this.replay = replay;
    this.replayAnalytics = replayAnalytics;
}

ReplayFileInfo.prototype.getFilePath = function() {
    return this.filePath;
};

ReplayFileInfo.prototype.getReplay = function() {
    return this.replay;
};

ReplayFileInfo.prototype.getReplayAnalytics = function() {
    return this.replayAnalytics;
};

ReplayFileInfo.prototype.printLevelReplayFileInfo =
    function() {
    var path = require("path");
    var infoDumpStrings = [
        "================================\n",
        "File: ", path.basename(this.getFilePath()), "\n",
        "Tester id: ", this.getReplayAnalytics().getTesterId(), "\n",
        "Level name: ", this.getReplay().getReplayInfo().getLevelName(), "\n",
        "Duration, sec: ", this.getReplayAnalytics().getReplayDurationMS() / 1000, "\n",
        "Is level finished: ", this.getReplay().getReplayInfo().getIsFinished(), "\n",
        "Coins collected: ", this.getReplayAnalytics().getCoinsCollectedNum(), "\n",
        "Idioms guessed (platformer): ", this.getReplayAnalytics().getPlatformerGuessedIdiomsCount(), "\n",
        "Idioms failed (platformer): ", this.getReplayAnalytics().getPlatformerFailedIdiomsCount(), "\n",
        "Test dialog right answers: ", this.getReplayAnalytics().getTestDialogRightAnswersCount(), "\n",
        "Test dialog wrong answers: ", this.getReplayAnalytics().getTestDialogWrongAnswersCount(), "\n",
        "Player min X: ", this.getReplayAnalytics().getMinPlayerX(), "\n",
        "Player max X: ", this.getReplayAnalytics().getMaxPlayerX(), "\n",
        "Player min Y: ", this.getReplayAnalytics().getMinPlayerY(), "\n",
        "Player max Y: ", this.getReplayAnalytics().getMaxPlayerY(), "\n",
        "Device name: ", this.getReplay().getReplayInfo().getDeviceName(), "\n",
        "Screen res: ", this.getReplay().getReplayInfo().getScreenRes(), "\n",
        "Game URL: ", this.getReplay().getReplayInfo().getGameURL(), "\n",
        "Host name: ", this.getReplay().getReplayInfo().getHostName(), "\n",
        "Time,date: ", this.getReplay().getReplayInfo().getTimeStampStr(), "\n"
    ];
    console.log(infoDumpStrings.join(""));
};

function printLevelReplayFileInfos(infos) {
    jQuery.each(infos, function(ix, info) {
        info.printLevelReplayFileInfo();
    });
}
