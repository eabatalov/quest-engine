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
        case LevelGameplayRecord.TYPES.PLAYER_POSITION:
            this.events.changePlayerPos.publish(
                gamePlayRecord.getPlayerX(),
                gamePlayRecord.getPlayerY()
            );
        break;
        case LevelGameplayRecord.TYPES.QUEST_EVENT:
            this.scriptExec.questEventExec(gamePlayRecord.getQuestEvent());
        break;
    }
};
