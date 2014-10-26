function printLevelReplayFileInfo(info) {
    var path = require("path");
    var infoDumpStrings = [
        "================================\n",
        "File: ", path.basename(info.filePath), "\n",
        "Tester id: ", info.replayAnalytics.getTesterId(), "\n",
        "Level name: ", info.replay.getReplayInfo().getLevelName(), "\n",
        "Duration, sec: ", info.replayAnalytics.getReplayDurationMS() / 1000, "\n",
        "Is level finished: ", info.replay.getReplayInfo().getIsFinished(), "\n",
        "Coins collected: ", info.replayAnalytics.getCoinsCollectedNum(), "\n",
        "Idioms guessed (platformer): ", info.replayAnalytics.getPlatformerGuessedIdiomsCount(), "\n",
        "Idioms failed (platformer): ", info.replayAnalytics.getPlatformerFailedIdiomsCount(), "\n",
        "Test dialog right answers: ", info.replayAnalytics.getTestDialogRightAnswersCount(), "\n",
        "Test dialog wrong answers: ", info.replayAnalytics.getTestDialogWrongAnswersCount(), "\n",
        "Player min X: ", info.replayAnalytics.getMinPlayerX(), "\n",
        "Player max X: ", info.replayAnalytics.getMaxPlayerX(), "\n",
        "Player min Y: ", info.replayAnalytics.getMinPlayerY(), "\n",
        "Player max Y: ", info.replayAnalytics.getMaxPlayerY(), "\n",
        "Device name: ", info.replay.getReplayInfo().getDeviceName(), "\n",
        "Screen res: ", info.replay.getReplayInfo().getScreenRes(), "\n",
        "Game URL: ", info.replay.getReplayInfo().getGameURL(), "\n",
        "Host name: ", info.replay.getReplayInfo().getHostName(), "\n",
        "Time,date: ", info.replay.getReplayInfo().getTimeStampStr(), "\n"
    ];
    console.log(infoDumpStrings.join(""));
}

function printLevelReplayFileInfos(infos) {
    jQuery.each(infos, function(ix, info) {
        printLevelReplayFileInfo(info);
    });
}
