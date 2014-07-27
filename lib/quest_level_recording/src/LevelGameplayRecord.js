function LevelGameplayRecord(type) {
    /* 
     * Offset from 'base' timestamp.
     * In milleseconds.
     */
    this.relTimeStampMs = 0;
    this.recType = type;
}

/* XXX
 * Type should be globally unique.
 * So collect here types of all the components
 * not to spread them and enforce their global
 * uniqueness in different places.
 */
LevelGameplayRecord.TYPES = {
    PLAYER_POSITION : 1,
    QUEST_EVENT : 2,
    //---
    JUMPER_GEN_PLATFORM : 1000,
    JUMPER_GEN_IDIOM_TOKEN : 1001,
    JUMPER_IDIOM_TO_GUESS_CHANGE : 1002,
    JUMPER_COLLECTED_IDIOM_SUBSTRING_CHANGE : 1003
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
