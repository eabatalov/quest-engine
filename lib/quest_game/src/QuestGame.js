function QuestGame(name, levelRepo, persistentStorage, inAppPurchaseProvider) {
    this.name = name;
    this.levelRepo = levelRepo;
    this.persistentStorage = persistentStorage;
    this.inAppPurchaseProvider = inAppPurchaseProvider;

    this.events = {
        levelChanged: new SEEvent(/* level */)
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
    //Lazy level loading
    this.levelRepo.addLevel(levelName);
    this.levelRepo.waitAllPendingRequests(function() {
        this.events.levelChanged.publish(
            this.levelRepo.getLevelByName(levelName)
        );
    }.bind(this));
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
    return this.LevelRepository;
};

// ==================================================
// Save/Load

QuestGame.magic = "zahw4W";
/*
 * returns: plain js object with all the game state
 */
QuestGame.prototype.save = function() {
    var savedData = {
        ver : 1,
        magic : QuestGame.magic,
        name : this.name,
        levelRepo : this.levelRepo.save()//,
        //inAppPurchaseProvider : inAppPurchaseProvider.save()
    };
    return savedData;
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
 * Saves plain js game object to persistent storage
 */
QuestGame.prototype.saveToRepo = function(savedData) {
    this.persistentStorage.put('Game_' + this.name, savedData);
};

/*
 * Loads plain js game object from persistent storage
 * returns: plain js game object
 */
QuestGame.loadFromRepo = function(gameName, persistentStorage) {
    var savedData = persistentStorage.get('Game_' + gameName);
    return savedData;
};
