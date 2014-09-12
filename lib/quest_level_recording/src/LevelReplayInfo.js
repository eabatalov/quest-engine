function LevelReplayInfo(levelName, devName, screenRes, gameURL,
    hostName, timeStampStr) {
    this.levelName = levelName || "unknown";
    this.devName = devName || LevelReplayInfo._getClientDeviceName();
    this.screenRes = screenRes || LevelReplayInfo._getClientScreenResolution();
    this.gameURL = gameURL || LevelReplayInfo._getClientGameURL();
    this.setHostName(hostName);
    this.setTimeStampStr(timeStampStr);
}

LevelReplayInfo.prototype.getLevelName = function() {
    return this.levelName;
};

LevelReplayInfo.prototype.getDeviceName = function() {
    return this.devName;
};

LevelReplayInfo.prototype.getScreenRes = function() {
    return this.screenRes;
};

LevelReplayInfo.prototype.getGameURL = function() {
    return this.gameURL;
};

LevelReplayInfo.prototype.getHostName = function() {
    return this.hostName;
};

LevelReplayInfo.prototype.setHostName = function(value) {
    this.hostName = value || LevelReplayInfo._getClientHostName();
};

LevelReplayInfo.prototype.getTimeStampStr = function() {
    return this.timeStampStr;
};

LevelReplayInfo.prototype.setTimeStampStr = function(value) {
    this.timeStampStr = value || LevelReplayInfo._getClientTimeStampStr();
};

// ==== SAVE/LOAD ====
LevelReplayInfo.prototype.save = function() {
    var savedData = {
        ver : 1,
        levelName : this.getLevelName(),
        devName : this.getDeviceName(),
        screenRes : this.getScreenRes(),
        gameURL : this.getGameURL(),
        hostName : this.getHostName(),
        timeStampStr : this.getTimeStampStr()
    };
    return savedData;
};

LevelReplayInfo.load = function(savedData) {
    assert(savedData.ver === 1, "LevelReplayInfo load: saved version is valid");

    var replay = new LevelReplayInfo(
        savedData.levelName,
        savedData.devName,
        savedData.screenRes,
        savedData.gameURL,
        savedData.hostName,
        savedData.timeStampStr
    );
    return replay;
};

//==== Client data collection cross-platform implementations ====
// Runtime dependant implementations is in separate files
LevelReplayInfo._getClientDeviceName = function() {
    return "unknown";
};

LevelReplayInfo._getClientScreenResolution = function() {
    return "unknown";
};

LevelReplayInfo._getClientGameURL = function() {
    return "unknown";
};

LevelReplayInfo._getClientHostName = function() {
    return "unknown";
};

LevelReplayInfo._getClientTimeStampStr = function() {
    return (new Date).toString().replace(/ /g, '_');
};
