/*
 * @customType: string unique in scope of all customTypes
 * @customData: any serializable/deserializable by JSON object.
 */
function CustomGameplayRecord(customType, customData) {
    LevelGameplayRecord.call(this, CustomGameplayRecord.type);
    this._customType = customType;
    this._customData = customData;
}

CustomGameplayRecord.type = 3;
CustomGameplayRecord.prototype =
    new LevelGameplayRecord(CustomGameplayRecord.type);

CustomGameplayRecord.prototype.getCustomType = function() {
    return this._customType;
};

CustomGameplayRecord.prototype.getCustomData = function() {
    return this._customData;
};

CustomGameplayRecord.prototype.save = function() {
    var savedData = {
        rec : LevelGameplayRecord.prototype.save.call(this),
        tp : this._customType,
        dt : this._customData
    };
    return savedData;
};

CustomGameplayRecord.load = function(savedData) {
    var customRec = new CustomGameplayRecord(
        savedData.tp,
        savedData.dt
    );
    LevelGameplayRecord.load(savedData.rec, customRec);
    return customRec;
};

LevelGameplayRecord.registerLevelGameplayRecordLoader(
    CustomGameplayRecord.type, CustomGameplayRecord.load
);
