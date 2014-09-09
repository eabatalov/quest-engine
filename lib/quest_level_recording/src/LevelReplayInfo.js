function LevelReplayInfo(devName, screenRes, gameURL, hostName) {
    this.devName = devName || LevelReplayInfo._getClientDeviceName();
    this.screenRes = screenRes || LevelReplayInfo._getClientScreenResolution();
    this.gameURL = gameURL || LevelReplayInfo._getClientGameURL();
    this.hostName = hostName || LevelReplayInfo._getClientHostName();
}

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

// ==== SAVE/LOAD ====
LevelReplayInfo.prototype.save = function() {
    var savedData = {
        ver : 1,
        devName : this.getDeviceName(),
        screenRes : this.getScreenRes(),
        gameURL : this.getGameURL(),
        hostName : this.getHostName()
    };
    return savedData;
};

LevelReplayInfo.load = function(savedData) {
    assert(savedData.ver === 1, "LevelReplayInfo load: saved version is valid");

    var replay = new LevelReplayInfo(
        savedData.devName,
        savedData.screenRes,
        savedData.gameURL,
        savedData.hostName
    );
    return replay;
};

//==== Client data collection mocks ====
// Check for runtime dependant implementations in separate files
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
