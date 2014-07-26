function PlayerPositionRecord(playerX, playerY) {
    LevelGameplayRecord.call(this, LevelGameplayRecord.TYPES.PLAYER_POSITION);
    this.playerX = playerX;
    this.playerY = playerY;
}

PlayerPositionRecord.prototype =
    new LevelGameplayRecord(LevelGameplayRecord.TYPES.PLAYER_POSITION);

PlayerPositionRecord.prototype.getPlayerX = function() {
    return this.playerX;
};

PlayerPositionRecord.prototype.getPlayerY = function() {
    return this.playerY;
};

PlayerPositionRecord.prototype.save = function() {
    var savedData = {
        rec : LevelGameplayRecord.prototype.save.call(this),
        px : this.playerX,
        py : this.playerY
    };
    return savedData;
};

PlayerPositionRecord.load = function(savedData) {
    var plPosRec = new PlayerPositionRecord(savedData.px, savedData.py);
    LevelGameplayRecord.load(savedData.rec, plPosRec);
    return plPosRec;
};