function LevelGameplayRecord(type) {
    /* 
     * Offset from 'base' timestamp.
     * In milleseconds.
     */
    this.relTimeStampMs = 0;
    this.recType = type;
}

LevelGameplayRecord.TYPES = {
    INVALID : 0,
    PLAYER_POSITION : 1,
    QUEST_EVENT : 2
};

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
