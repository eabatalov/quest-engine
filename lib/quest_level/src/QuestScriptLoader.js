function QuestScriptLoader(textFileLoader) {
    this.textFileLoader = textFileLoader;
}

QuestScriptLoader.prototype.load = function(scriptName, callback) {
    this.textFileLoader.load(questScriptFileName(scriptName),
        function(questScriptTxt) {
            console.log("Quest script " + scriptName + " load was performed");

            var savedQuestScript = JSON.parse(questScriptTxt);
            var script = loadQuestScript(savedQuestScript); 

            if (callback)
                callback(script);
        }
     );
};
