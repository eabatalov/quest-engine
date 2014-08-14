function QuestLevelReplayPlayer(scriptExec) {
    LevelReplayPlayer.call(this);
    this.scriptExec = scriptExec;

    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/)
    };
}

QuestLevelReplayPlayer.prototype = new LevelReplayPlayer();

QuestLevelReplayPlayer.prototype._playRecord = function(gamePlayRecord) {
    switch(gamePlayRecord.getRecordType()) {
        case PlayerPositionRecord.type:
            this.events.changePlayerPos.publish(
                gamePlayRecord.getPlayerX(),
                gamePlayRecord.getPlayerY()
            );
        break;
        case QuestEventRecord.type:
            this.scriptExec.questEventExec(gamePlayRecord.getQuestEvent());
        break;
    }
};
