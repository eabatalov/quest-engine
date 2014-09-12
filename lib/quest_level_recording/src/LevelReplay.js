function LevelReplay(levelGameplayHistory, replayInfo) {
    this.history = levelGameplayHistory;
    this.replayInfo = replayInfo || new LevelReplayInfo();
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
        replayInfo : this.getReplayInfo().save()
    };
    return savedData;
};

LevelReplay.load = function(savedData) {
    assert(savedData.ver === 1, "LevelReplay load: saved version is valid");

    var history = LevelGameplayHistory.load(savedData.history);
    var replayInfo = LevelReplayInfo.load(savedData.replayInfo);
    var replay = new LevelReplay(history, replayInfo);
    return replay;
};
