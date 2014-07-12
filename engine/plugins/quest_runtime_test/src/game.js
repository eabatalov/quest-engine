function DemoQuestGame(name, levelRepo, persistentStorage, inAppPurchaseProvider) {
    QuestGame.call(this, name, levelRepo, persistentStorage, inAppPurchaseProvider);
};

DemoQuestGame.prototype = QuestGame.prototype;
DemoQuestGame.prototype.constructor = DemoQuestGame;

/*
 * "Inherit" base game class methods
 */
DemoQuestGame.magic = "Zee7Zo";
DemoQuestGame.newGame = QuestGame.newGame;
DemoQuestGame.load = QuestGame.load;

QuestGame.bootstrap(
    {
        game : {
            className : 'DemoQuestGame',
            name : 'Demo',
            params : []
        },

        persistentStorage : {
            className : 'HTML5PersistentStorage',
            params : []
        },

        levelLoader : {
            className : 'QuestLevelLoader',
            params : [new AjaxQuestScriptLoader('')]
        }
    }
);

