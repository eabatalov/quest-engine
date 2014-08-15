function LevelReplay(levelGameplayHistory, level) {
    this.history = levelGameplayHistory;
    this.level = level;
    this.devName = null;
    this.screenRes = null;
    this.gameURL = null;
};

LevelReplay.prototype.getLevelName = function() {
    return this.level.getName();
};

LevelReplay.prototype.getGameplayHistory = function() {
    return this.history;
};

LevelReplay.prototype.getDeviceName = function() {
    return this.devName;
};

LevelReplay.prototype.getScreenRes = function() {
    return this.screenRes;
};

LevelReplay.prototype.getGameURL = function() {
    return this.gameURL;
};

//==== SAVE/LOAD ====
LevelReplay.prototype.save = function() {
    var savedData = {
        ver : 1,
        history : this.history.save(),
        levelName : this.getLevelName(),
        devName : LevelReplay.getDeviceName(),
        screenRes : LevelReplay.getScreenResolution(),
        gameURL : LevelReplay.getGameURL()
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
    var replay = new LevelReplay(history, level);
    replay.devName = savedData.devName;
    replay.screenRes = savedData.screenRes;
    replay.gameURL = savedData.gameURL;
    return replay;
};

//==== Player statistics collection  ====
LevelReplay.getDeviceName = function() {
    return navigator ? navigator.userAgent : "unknown";
};

LevelReplay.getScreenResolution = function() {
    var vr = window.screen.availHeight;
    vr = vr ? vr.toString() : "invalid";

    var hr = window.screen.availWidth;
    hr = hr ? hr.toString() : "invalid";
    return hr + "x" + vr;
};

LevelReplay.getGameURL = function() {
    return document.URL ? document.URL : "unknown";
};
