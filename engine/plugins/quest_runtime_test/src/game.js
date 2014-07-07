function DemoQuestGame(name, levelRepo, persistentStorage, inAppPurchaseProvider) {
    QuestGame.call(this, name, levelRepo, persistentStorage, inAppPurchaseProvider);
};

DemoQuestGame.prototype = QuestGame.prototype;
DemoQuestGame.prototype.constructor = DemoQuestGame;

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
            className : 'AjaxQuestScriptLoader',
            params : ['']
        }
    }
);

