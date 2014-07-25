function QuestEventRecord(questEvent) {
    LevelGameplayRecord.call(this, LevelGameplayRecord.TYPES.QUEST_EVENT);
    this.questEvent = questEvent;
}

QuestEventRecord.prototype =
    new LevelGameplayRecord(LevelGameplayRecord.TYPES.QUEST_EVENT);

QuestEventRecord.prototype.getQuestEvent = function() {
    return this.questEvent;
};

QuestEventRecord.prototype.save = function() {
    var savedData = {
        rec : LevelGameplayRecord.save.call(this),
        qe : this.questEvent.save()
    };
    return savedData;
};

QuestEventRecord.load = function(savedData) {
    var questEventRec = new QuestEventRecord(QuestEvent.load(saveData.qe));
    LevelGameplayRecord.load(savedData.rec, questEventRec);
    return questEventRec;
};
