/*
 * Instance of this class sotres all the LevelGameplayRecords
 * collected for particular level from all record aollection sources.
 * Thus it represents complete gameplay history of a single level.
 */
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
    hist.records = savedData.records.map(loadByRecType);
    return hist;

    function loadByRecType(recSaved) {
        var recLoader = LevelGameplayRecord.getRecTypeLoader(recSaved.type);
        return recLoader(recSaved.rec);
    };
};
