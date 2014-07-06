function QuestGame(name, levelRepo, persistentStorage, inAppPurchaseProvider) {
    this.name = name;
    this.levelRepo = levelRepo;
    this.questLevelRuntime = null;
    this.persistentStorage = persistentStorage;
    this.inAppPurchaseProvider = inAppPurchaseProvider;
}

/*
 * Create totally new game (first game run)
 */
QuestGame.newGame = function(name, levelLoader, persistentStorage, inAppPurchaseProvider) {
    return new QuestGame(name, new LevelRepository(levelLoader), persistentStorage,
        inAppPurchaseProvider);
};

/*
 * Do all the needed stuff to start the game
 * @config: {
 *  game: {
 *      className: string,
 *      name:
 *      params: []
 *  },
 *  persistentStorage: {
 *      className: string,
 *      params: []
 *  },
 *  inAppPurchaseProvider: {
 *      className: string,
 *      params: []
 *  },
 *  levelLoader : {
 *      className: string,
 *      params: []
 *  },
 * };
 */
QuestGame.instance = null;
QuestGame.config = null;
QuestGame.bootstrap = function(config) {
    var createPersistentStorageCode = "";
    var createInAppPurchaseProviderCode = "";
    var createLevelLoaderCode = "";
    var createGameCode = "";

    if (config.persistentStorage) {
        createPersistentStorageCode = "var persistentStorage = new "
            + config.persistentStorage.className + "(";
        for(var paramIx = 0; paramIx < config.persistentStorage.params.length; ++paramIx) {
            createPersistentStorageCode +=
                "config.persistentStorage.params[" + paramIx.toString() + "],";
        };
        createPersistentStorageCode += "null);"; //fix comma
    } else {
        createPersistentStorageCode = "var persistentStorage = null;";
    }

    if (config.inAppPurchaseProvider) {
        createInAppPurchaseProviderCode = "var inAppPurchaseProvider = new "
            + config.inAppPurchaseProvider.className + "(";
        for(var paramIx = 0; paramIx < config.inAppPurchaseProvider.params.length; ++paramIx) {
            createInAppPurchaseProviderCode +=
                "config.inAppPurchaseProvider.params[" + paramIx.toString() + "],";
        };
        createInAppPurchaseProviderCode += "null);"; //fix comma
    } else {
        createInAppPurchaseProviderCode = "var inAppPurchaseProvider = null;";
    }

    if (config.levelLoader) {
        createLevelLoaderCode = "var levelLoader = new "
            + config.levelLoader.className + "(";
        for(var paramIx = 0; paramIx < config.levelLoader.params.length; ++paramIx) {
            createLevelLoaderCode +=
                "config.levelLoader.params[" + paramIx.toString() + "],";
        };
        createLevelLoaderCode += "null);"; //fix comma
    } else {
        createLevelLoaderCode = "var levelLoader = null;";
    }

    eval(createPersistentStorageCode);
    eval(createInAppPurchaseProviderCode);
    eval(createLevelLoaderCode);

    var savedGame = QuestGame.loadFromRepo(config.game.name, persistentStorage);
    if (savedGame === "") {
        ////New game
        var createGameCode = "var game = " + config.game.className + ".newGame("
            "config.game.name, levelLoader, persistentStorage, inAppPurchaseProvider"
        ");";

    } else {
        //Load game
        var createGameCode = "var game = " + config.game.className + ".load("
            + 'savedGame, levelLoader, persistentStorage, inAppPurchaseProvider);'
    }

    eval(createGameCode);

    QuestGame.instance = game;
    eval(config.game.className + ".instance = game;");
}

// =================================================
// Runtime logic
QuestGame.prototype.regQuestLevelRuntime = function(questLevelRuntime) {
    this.questLevelRuntime = questLevelRuntime;
};

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
    assert(savedData.magic === 1);

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
