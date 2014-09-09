function LevelReplay(levelGameplayHistory, level, replayInfo) {
    this.history = levelGameplayHistory;
    this.level = level;
    this.replayInfo = replayInfo || new LevelReplayInfo();
};

LevelReplay.prototype.getLevelName = function() {
    return this.level.getName();
};

LevelReplay.prototype.getGameplayHistory = function() {
    return this.history;
};

LevelReplay.prototype.getReplayInfo = function() {
    return this.replayInfo;
};

//==== SAVE/LOAD ====
LevelReplay.prototype.save = function() {
    var savedData = {
        ver : 1,
        history : this.history.save(),
        levelName : this.getLevelName(),
        replayInfo : this.getReplayInfo().save()
    };
    return savedData;
};

LevelReplay.load = function(savedData, level) {
    assert(savedData.ver === 1, "LevelReplay load: saved version is valid");
    if (savedData.levelName !== level.getName()) {
        console.warn("Level name of loaded level replay ", savedData.levelName,
            "is not equal to passed level name", level.getName());
    }

    var history = LevelGameplayHistory.load(savedData.history);
    var replayInfo = LevelReplayInfo.load(savedData.replayInfo);
    var replay = new LevelReplay(history, level, replayInfo);
    return replay;
};
