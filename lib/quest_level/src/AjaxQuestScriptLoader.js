function AjaxQuestScriptLoader(baseUrl) {
    this.baseUrl = baseUrl || '';
}

AjaxQuestScriptLoader.prototype = new IQuestScriptLoader();
AjaxQuestScriptLoader.prototype.constructor = AjaxQuestScriptLoader;

AjaxQuestScriptLoader.prototype.load = function(scriptName, callback) {
    var scriptUrl = this.baseUrl + '/' + scriptName;
    jQuery.getScript(scriptUrl, function(data, textStatus, jqxhr) {
        console.log("Quest script load was performed");
        console.log("Script URL: " + scriptURL);
        var getQuestFunctionName = "getQuestScript" + scriptName;
        var script = window[getQuestFunctionName]();
        if (callback)
            callback(script);
    });
};
