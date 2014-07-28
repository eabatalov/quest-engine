function QuestLevelGameplayPlayer(scriptExec) {
    LevelGameplayPlayer.call(this);
    this.scriptExec = scriptExec;

    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/)
    };
}

QuestLevelGameplayPlayer.prototype = new LevelGameplayPlayer();

QuestLevelGameplayPlayer.prototype._playRecord = function(gamePlayRecord) {
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
