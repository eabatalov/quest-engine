function QuestEventRecord(questEvent) {
    LevelGameplayRecord.call(this, QuestEventRecord.type);
    this.questEvent = questEvent;
}

QuestEventRecord.type = 2;
QuestEventRecord.prototype = new LevelGameplayRecord(QuestEventRecord.type);

QuestEventRecord.prototype.getQuestEvent = function() {
    return this.questEvent;
};

QuestEventRecord.prototype.save = function() {
    var savedData = {
        rec : LevelGameplayRecord.prototype.save.call(this),
        qe : this.questEvent.save()
    };
    return savedData;
};

QuestEventRecord.load = function(savedData) {
    var questEventRec = new QuestEventRecord(QuestEvent.load(savedData.qe));
    LevelGameplayRecord.load(savedData.rec, questEventRec);
    return questEventRec;
};

LevelGameplayRecord.registerLevelGameplayRecordLoader(
    QuestEventRecord.type, QuestEventRecord.load
);
