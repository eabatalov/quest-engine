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
                "eval(config.persistentStorage.params[" + paramIx.toString() + "]),";
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
                "eval(config.inAppPurchaseProvider.params[" + paramIx.toString() + "]),";
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
                "eval(config.levelLoader.params[" + paramIx.toString() + "]),";
        };
        createLevelLoaderCode += "null);"; //fix comma
    } else {
        createLevelLoaderCode = "var levelLoader = null;";
    }

    eval(createPersistentStorageCode);
    eval(createInAppPurchaseProviderCode);
    eval(createLevelLoaderCode);

    var savedGame = QuestGame.loadFromStorage(config.game.name, persistentStorage);
    if (savedGame === null) {
        //New game
        var createGameCode = "var game = " + config.game.className + ".newGame("
            + "config.game.name, levelLoader, persistentStorage, inAppPurchaseProvider"
        + ");";

    } else {
        //Load game
        var createGameCode = "var game = " + config.game.className + ".load("
            + 'savedGame, levelLoader, persistentStorage, inAppPurchaseProvider);'
    }

    eval(createGameCode);

    QuestGame.instance = game;
    eval(config.game.className + ".instance = game;");

    return game;
}
