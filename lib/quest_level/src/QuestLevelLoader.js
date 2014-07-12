function QuestLevelLoader(questScriptLoader) {
    this.questScriptLoader = questScriptLoader;
}

QuestLevelLoader.prototype = new ILevelLoader();
QuestLevelLoader.prototype.constructor = QuestLevelLoader;

QuestLevelLoader.prototype.create = function(levelName, callback) {
    // by current policy level and quest script names are the same
    this.questScriptLoader.load(levelName, function(script) {
        var level = new QuestLevel(levelName, script);
        callback(level);
    });
};

QuestLevelLoader.prototype.load = function(levelSavedData, callback) {
    // by current policy level and quest script names are the same
    var levelName = QuestLevel.loadName(levelSavedData);
    this.questScriptLoader.load(levelName, function(script) {
        var level = QuestLevel.load(levelSavedData, script);
        callback(level);
    });
};
