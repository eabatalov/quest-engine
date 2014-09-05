function QuestLevelReplayPlayer(scriptExec) {
    LevelReplayPlayer.call(this);
    this.scriptExec = scriptExec;
}

QuestLevelReplayPlayer.prototype = new LevelReplayPlayer();

QuestLevelReplayPlayer.prototype._playRecord = function(gamePlayRecord) {
    switch(gamePlayRecord.getRecordType()) {
        case PlayerPositionRecord.type:
            this.events.recReady.publish(gamePlayRecord);
        break;
        case QuestEventRecord.type:
            this.scriptExec.questEventExec(gamePlayRecord.getQuestEvent());
        break;
    }
};
