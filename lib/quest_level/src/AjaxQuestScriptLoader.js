function AjaxQuestScriptLoader(baseUrl) {
    this.baseUrl = baseUrl ? baseUrl + '/' : '';
}

AjaxQuestScriptLoader.prototype = new IQuestScriptLoader();
AjaxQuestScriptLoader.prototype.constructor = AjaxQuestScriptLoader;

AjaxQuestScriptLoader.prototype.load = function(scriptName, callback) {
    var scriptUrl = this.baseUrl + questScriptFileName(scriptName);
    console.log("Loading quest script by URL: " + scriptUrl);

    jQuery.getJSON(scriptUrl, function(savedQuestScript) {
        console.log("Quest script " + scriptName + " load was performed");
        var script = loadQuestScript(savedQuestScript); 

        if (callback)
            callback(script);
    });
};
