function LevelGameplayRecord(type) {
    /* 
     * Offset from 'base' timestamp.
     * In milleseconds.
     */
    this.relTimeStampMs = 0;
    /*
     * Level gameplay record type should be globally unique for each
     * LevelGameplayRecord subclass
     */
    this.recType = type;
}

/*
 * Set timestamp at current time
 * @tsBaseMs: global recording start time to get offset from
 */
LevelGameplayRecord.prototype.updTimeStamp = function(tsBaseMs) {
    this.relTimeStampMs = Date.now() - tsBaseMs;
};

LevelGameplayRecord.prototype.getTimeStampMs = function() {
    return this.relTimeStampMs;
};

LevelGameplayRecord.prototype.getRecordType = function() {
    return this.recType;
};

LevelGameplayRecord.prototype.save = function() {
    var savedData = {
        ts : this.relTimeStampMs,
        rt : this.recType
    };
    return savedData;
};

LevelGameplayRecord.load = function(savedData, to) {
    to = to || new LevelGameplayRecord(savedData.rt);
    to.relTimeStampMs = savedData.ts;
    to.recType = savedData.rt;
    return to;
};

LevelGameplayRecord._loaders = {};

LevelGameplayRecord.registerLevelGameplayRecordLoader = function(levelGameplayRecType, loader) {
    assert(!LevelGameplayRecord._loaders[levelGameplayRecType],
        "Registered levelGameplayRecType is unique");
    LevelGameplayRecord._loaders[levelGameplayRecType] = loader;
};

LevelGameplayRecord.getRecTypeLoader = function(levelGameplayRecType) {
    var loader = LevelGameplayRecord._loaders[levelGameplayRecType];
    assert(loader, "Record type loader exists");
    return loader;
};
