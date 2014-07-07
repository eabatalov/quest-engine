function questScriptFileName(scriptName) {
        return scriptName + "_script.js";
}

/*
 * Requires libs: filesaver, blob
 */
function saveQuestScript(script) {
    var scriptSavedJSON = JSON.stringify(script.save(), null, '\t');
    var scriptSavedBlob = new Blob([scriptSavedJSON], { type : 'application/javascript' });
    var fileName = questScriptFileName(script.getName());
    saveAs(scriptSavedBlob, fileName);
    return fileName;
}

function loadQuestScript(savedQuestScript) {
    return SEScript.load(savedQuestScript);
}
