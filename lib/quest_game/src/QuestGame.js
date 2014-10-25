function QuestGame(name, gameInitDict){
    if (!name)
        return; //subclass prototype creation

    this.name = name;
    this.levelRepo = gameInitDict["levelRepo"];
    this.persistentStorage = gameInitDict["persistentStorage"];
    this.inAppPurchaseProvider = gameInitDict["inAppPurchaseProvider"];
    this.levelReplayLoader = gameInitDict["levelReplayLoader"];
    this.textFileLoader = gameInitDict["textFileLoader"];
    this.currentLevelRuntime = null;

    this.events = {
        levelChanged: new SEEvent(/*QuestLevelRuntime*/),
        /* Use this when you want all the transitions of components you may depend on
         * to be finished */
        levelChangedAfter: new SEEvent(/*QuestLevelRuntime*/),
    };
}

/*
 * Create totally new game (first game run)
 */
QuestGame.newGame = function(name, gameInitDict) {
    gameInitDict["levelRepo"] =
        new LevelRepository(gameInitDict["levelLoader"]);
    return new QuestGame(name, gameInitDict);
};

QuestGame.prototype.setCurrentLevelByName = function(levelName) {
    //Lazy level loading
    this.levelRepo.addLevel(levelName);
    this.levelRepo.waitAllPendingRequests(function() {
        var level = this.levelRepo.getLevelByName(levelName);
        this.currentLevelRuntime = new QuestLevelRuntime(level);
        this.events.levelChanged.publish(this.currentLevelRuntime);
        this.events.levelChangedAfter.publish(this.currentLevelRuntime);
    }.bind(this));
};

QuestGame.prototype.getName = function() {
    return this.name;
};

// =================================================
// Getters for linking with all other game elements
QuestGame.prototype.getPersistentStorage = function() {
    return this.persistentStorage;
};

QuestGame.prototype.getInAppPurchaseProvider = function() {
    return this.inAppPurchaseProvider;
};

QuestGame.prototype.getLevelRepo = function() {
    return this.levelRepo;
};

QuestGame.prototype.getLevelReplayLoader = function() {
    return this.levelReplayLoader;
};

QuestGame.prototype.getTextFileLoader = function() {
    return this.textFileLoader;
};

QuestGame.prototype.getCurrentLevelRuntime = function() {
    return this.currentLevelRuntime;
};

// ==================================================
// Save/Load

QuestGame.magic = "zahw4W";

/*
 * returns: plain js object with all the game state
 */
QuestGame.prototype._save = function() {
    var savedData = {
        ver : 1,
        magic : QuestGame.magic,
        name : this.name,
        levelRepo : this.levelRepo.save()
        //,inAppPurchaseProvider : inAppPurchaseProvider.save()
    };
    return savedData;
};
/*
 * Saves plain js game object to persistent storage
 */
QuestGame.prototype._saveToStorage = function(savedData) {
    var savedDataStr = JSON.stringify(savedData);
    this.persistentStorage.put('Game_' + this.name, savedDataStr);
};

QuestGame.prototype.save = function() {
    this._saveToStorage(this._save());
};

/*
 * @savedData: plain js object previously saved with save() call
 * returns: restored instance of QuestGame
 */
QuestGame.load = function(savedData, gameInitDict) {
    assert(savedData.ver === 1);
    assert(savedData.magic === QuestGame.magic);

    gameInitDict["levelRepo"] = LevelRepository.load(
        savedData.levelRepo,
        gameInitDict["levelLoader"]
    );
    var game = new QuestGame(savedData.name, gameInitDict);
    return game;
};

/*
 * Loads plain js game object from persistent storage
 * returns: plain js game object
 */
QuestGame.loadFromStorage = function(gameName, persistentStorage) {
    var savedDataStr = persistentStorage.get('Game_' + gameName);
    if (savedDataStr === "")
        return null;

    return JSON.parse(savedDataStr);
};
