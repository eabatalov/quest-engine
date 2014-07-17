function QuestGame(name, levelRepo, persistentStorage, inAppPurchaseProvider) {
    this.name = name;
    this.levelRepo = levelRepo;
    this.persistentStorage = persistentStorage;
    this.inAppPurchaseProvider = inAppPurchaseProvider;

    this.events = {
        levelChanged: new SEEvent(/* level */),
        /* Use this when you want all the transitions of components you may depend on
         * to be finished */
        levelChangedAfter: new SEEvent(/* level */),
        levelBeforeChange: new SEEvent()
    };
}

/*
 * Create totally new game (first game run)
 */
QuestGame.newGame = function(name, levelLoader, persistentStorage, inAppPurchaseProvider) {
    return new QuestGame(name, new LevelRepository(levelLoader), persistentStorage,
        inAppPurchaseProvider);
};

QuestGame.prototype.setCurrentLevelByName = function(levelName) {
    this.events.levelBeforeChange.publish();
    //Lazy level loading
    this.levelRepo.addLevel(levelName);
    this.levelRepo.waitAllPendingRequests(function() {
        this.events.levelChanged.publish(
            this.levelRepo.getLevelByName(levelName)
        );
        this.events.levelChangedAfter.publish(
            this.levelRepo.getLevelByName(levelName)
        );
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
QuestGame.load = function(savedData, levelLoader, persistentStorage, inAppPurchaseProvider) {
    assert(savedData.ver === 1);
    assert(savedData.magic === QuestGame.magic);

    var levelRepo = LevelRepository.load(savedData.levelRepo, levelLoader);
    var game = new QuestGame(savedData.name,
        levelRepo, persistentStorage, inAppPurchaseProvider);
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
