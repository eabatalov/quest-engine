function TestDialogScriptLoader(textFileLoader) {
    this.textFileLoader = textFileLoader;
}

TestDialogScriptLoader.prototype.load = function(scriptName, callback) {
    var scriptFileName = scriptName + "_test_dialog.json";
    this.textFileLoader.load(scriptFileName, function(testDialogScriptText) {
        var testDialogScriptSaved = JSON.parse(testDialogScriptText);
        var testDialogScript = TestDialogScript.load(testDialogScriptSaved);

        callback(testDialogScript);
    });
};
