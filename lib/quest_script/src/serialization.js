function questScriptFileName(scriptName) {
        return scriptName + "_script.json";
}

function loadQuestScript(savedQuestScript) {
    return SEScript.load(savedQuestScript);
}
