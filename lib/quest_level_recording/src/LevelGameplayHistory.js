function LevelGameplayHistory() {
    this.isRestored = false;
    this.startMs = Date.now();
    this.records = [];
}

LevelGameplayHistory.prototype.addRecord = function(rec) {
    assert(!this.isRestored);
    rec.updTimeStamp(this.startMs);
    this.records.push(rec);
};

LevelGameplayHistory.prototype.recCnt = function() {
    return this.records.length;
};

/*
 * All the records are guaranteed to be sorted by
 * timestamp from earlier to later.
 */
LevelGameplayHistory.prototype.recAt = function(ix) {
    assert(ix < this.recCnt());
    return this.records[ix];
};

LevelGameplayHistory.prototype.save = function() {
    var savedData = {
        ver : 1,
        startMs : this.startMs,
        records : this.records.map(saveListRec)
    };
    return savedData;

    function saveListRec(rec) {
        return { type : rec.getRecordType(), rec : rec.save() };
    }
};

LevelGameplayHistory.load = function(savedData) {
    assert(savedData.ver === 1);

    var hist = new LevelGameplayHistory();
    hist.isRestored = true;
    hist.records = savedData.records.map(restoreRecord);
    return hist;

    function restoreRecord(recSaved) {
        var rec = null;
        switch(recSaved.type) {
            case LevelGameplayRecord.TYPES.PLAYER_POSITION:
                rec = PlayerPositionRecord.load(recSaved.rec);
            break;
            case LevelGameplayRecord.TYPES.QUEST_EVENT:
                rec = QuestEventRecord.load(recSaved.rec);
            break;
            //Total XXX
            case LevelGameplayRecord.TYPES.JUMPER_COLLECTED_IDIOM_SUBSTRING_CHANGE:
                rec = JumperCollectedIdiomSubstringChangedRecord.load(recSaved.rec);
            break;
            case LevelGameplayRecord.TYPES.JUMPER_GEN_IDIOM_TOKEN:
                rec = JumperGenIdiomTokenRecord.load(recSaved.rec);
            break;
            case LevelGameplayRecord.TYPES.JUMPER_IDIOM_TO_GUESS_CHANGE:
                rec = JumperIdiomToGuessChangedRecord.load(recSaved.rec);
            break;
            case LevelGameplayRecord.TYPES.JUMPER_GEN_PLATFORM:
                rec = JumperGenPlatformRecord.load(recSaved.rec);
            break;
            default:
                assert(false);
        }
        return rec;
    }
};
