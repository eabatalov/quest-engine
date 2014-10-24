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
 *  levelReplayLoader : {
 *      className: string,
 *      params: []
 *  },
 *  textFileLoader : {
 *      className: string.
 *      params: []
 *  }
 * };
 */
QuestGame.instance = null;
QuestGame.config = null;
QuestGame.bootstrap = function(config) {

    function genEvalParamsCodeList(componentName) {
        var codeList = [];
        for (var paramIx = 0; paramIx < config[componentName].params.length; ++paramIx) {
            codeList = codeList.concat(
                "eval(config.", componentName, ".params[", paramIx.toString(), "]),"
            );
        };
        codeList.push("null);"); //fix comma
        return codeList;
    };

    function genGameComponentCreationCode(componentName) {
        var nulledCode = ["var ", componentName, " = null;"].join("");
        if (!config[componentName]) 
            return nulledCode;
        
        var codeList = [
            "var ", componentName, " = new ",
            config[componentName].className, "("
        ];
        codeList = codeList.concat(genEvalParamsCodeList(componentName));
        return codeList.join("");
    };

    eval(genGameComponentCreationCode("persistentStorage"));
    eval(genGameComponentCreationCode("inAppPurchaseProvider"));
    eval(genGameComponentCreationCode("levelLoader"));
    eval(genGameComponentCreationCode("levelReplayLoader"));
    eval(genGameComponentCreationCode("textFileLoader"));

    var gameInitDict = {
        "persistentStorage" : persistentStorage,
        "inAppPurchaseProvider" : inAppPurchaseProvider,
        "textFileLoader" : textFileLoader,
        "levelLoader" : levelLoader,
        "levelReplayLoader" : levelReplayLoader,
        "misc" : []
    };

    var savedGame = QuestGame.loadFromStorage(config.game.name, persistentStorage);
    var createGameCodeList = ["var game = ", config.game.className];
    if (savedGame === null) {
        //New game
        createGameCodeList.push(".newGame(config.game.name, gameInitDict, ");
    } else {
        //Load game
        createGameCodeList.push(".load(savedGame, gameInitDict, ");
    }

    createGameCodeList = createGameCodeList.concat(genEvalParamsCodeList("game"));
    eval(createGameCodeList.join(""));

    QuestGame.instance = game;
    eval(config.game.className + ".instance = game;");

    return game;
}
