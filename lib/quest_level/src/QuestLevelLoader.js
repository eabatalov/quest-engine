function QuestLevelLoader(questScriptLoader) {
    this.questScriptLoader = questScriptLoader;
}

QuestLevelLoader.prototype = new ILevelLoader();
QuestLevelLoader.prototype.constructor = QuestLevelLoader;

QuestLevelLoader.prototype.load = function(levelName, callback) {
    // by current policy level and quest script names are the same
    this.questScriptLoader.load(levelName, function(script) {
        callback(new QuestLevel(levelName, script));
    });
};
