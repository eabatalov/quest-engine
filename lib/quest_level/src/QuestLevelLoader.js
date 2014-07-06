function QuestLevelLoader(questScriptLoader) {
    this.questScriptLoader = questScriptLoader;
}

QuestLevelLoader.prototype = new ILevelLoader();
QuestLevelLoader.prototype.constructor = QuestLevelLoader;

QuestLevelLoader.prototype.load = function(levelName, callback) {
    var level = new QuestLevel(levelName, undefined, this.questScriptLoader, callback);
};
