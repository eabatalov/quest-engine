/*
 * Requires libs: filesaver, blob
 */

function saveScript(script) {
    var scriptSavedJSON = JSON.stringify(script.save(), null, '\t');
    var scriptSavedJSONStringLiteral = JSON.stringify(scriptSavedJSON);

    var scriptLoaderCode = "function getQuestScript() {\n"
        + "var scriptSavedJSON = JSON.parse(\n"
        + scriptSavedJSONStringLiteral
        + "\n);\n"
        + "return SEScript.load(scriptSavedJSON);\n"
        + "}"

    var scriptSavedBlob = new Blob([scriptLoaderCode], { type : 'application/javascript' });
    var fileName = script.getName() + "_script.js";
    saveAs(scriptSavedBlob, fileName);
    return fileName;
}

/* 
 * To load script:
 * 1. Add script loader javascript file to web page via <script> tag
 * 2. Call getQuestScript() 
 */
