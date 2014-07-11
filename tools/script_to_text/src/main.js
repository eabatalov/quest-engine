var os = require('os');
var fs = require('fs');

var EOL = os.EOL;
var IDENT = 4;

function dump(text) {
    console.log(text);
}

/*
 * Cache identation strings not to load GC
 */
var identStrs = {};
function identText(text, ident) {
    if (identStrs[ident]) {
        var identStr = identStrs[ident];
    } else {
        var list = []
        for (var i = 0; i < ident; ++i) {
            list.push(" ");
        }
        var identStr = list.join('');
        identStrs[ident] = identStr;
    }
    return identStr + text;
}

//=======================================
var context = {
    stage : null
};

function isNodeTextual(node) {
    switch(node.getType()) {
        case _QUEST_NODES.STAGE:
        case _QUEST_NODES.STORYLINE:
        case _QUEST_NODES.PHRASE:
        case _QUEST_NODES.QUIZ:
        case _QUEST_NODES.NOTIFICATION:
            return true;
        case _QUEST_NODES.FUNC_CALL:
            /*
            * Dump FUNC_CALLs from init stage
            * Because they are usually contain
            * human readable data.
            */
            if (context.stage.getName() === "init")
                return true;
        default:
            return false;
    }
}

function isNodeWillBeDumped(node, nodesVisited) {
    return isNodeTextual(node) && !nodesVisited[node.getId()];
}

function nodeDump(node, ident) {
    if (!isNodeTextual(node))
        return;

    var text = identText("{ " + EOL, ident);
    ident += IDENT;
    switch(node.getType()) {
        case _QUEST_NODES.STAGE:
            text += identText("STAGE" + EOL, ident)
                + identText("participants: " +
                JSON.stringify(node.getProp("objs")) + EOL
                , ident);
            break;
        case _QUEST_NODES.STORYLINE:
             text += identText("STORYLINE" + EOL, ident)
                + identText("participants: " +
                JSON.stringify(node.getProp("objs")) + EOL
                , ident);
            break;
        case _QUEST_NODES.PHRASE:
            text += identText(phraseTypeText(node) + EOL, ident)
                + identText("actor: " + node.getProp("id") + EOL, ident)
                + identText("text: " + JSON.stringify(node.getProp("text")) + EOL, ident);
            break;
        case _QUEST_NODES.QUIZ:
            text += identText("QUIZ " + phraseTypeText(node) + EOL, ident)
                + identText("actor: " + node.getProp("id") + EOL, ident)
                + identText("text: " + JSON.stringify(node.getProp("text")) + EOL, ident)
                + identText("ans1: " + JSON.stringify(node.getProp("ans1")) + EOL, ident)
                + identText("ans2: " + JSON.stringify(node.getProp("ans2")) + EOL, ident)
                + identText("ans3: " + JSON.stringify(node.getProp("ans3")) + EOL, ident)
                + identText("ans4: " + JSON.stringify(node.getProp("ans4")) + EOL, ident);
            break;
        case _QUEST_NODES.NOTIFICATION:
            text += identText("NOTIFICATION" + EOL, ident)
                + identText("text: " + JSON.stringify(node.getProp("text")) + EOL, ident);
            break;
        case _QUEST_NODES.FUNC_CALL:
            var params = node.getProp("params");
            text += identText("FUNCTION CALL" + EOL, ident)
                + identText("name: " + node.getProp("name") + EOL, ident)
                + (params.length ? identText("parametes:" + EOL, ident) : "");
            ident += IDENT;
            $.each(params, function(ix, param) {
                text += identText(param.name + ": " + JSON.stringify(param.value) + EOL, ident);
            });
            ident -= IDENT;
        default:
    }
    ident -= IDENT;
    text += identText("}" + EOL, ident);
    dump(text);

    function phraseTypeText(node) {
        switch(node.getProp("phraseType")) {
            case _QUEST_PHRASE_TYPES.SPEAK:
                return "SPEAK";
            case _QUEST_PHRASE_TYPES.THINK:
                return "THINK";
        }
    };
}

function condDump(cond, ident, nodesVisited) {
    /*
     * Don't show connections between nodes we won't dump
     */
    if (isNodeWillBeDumped(cond.getDstNode(), nodesVisited))
        dump(identText("|__", ident));
}

function stageDump(stage) {
    dump("=================================" + EOL
        + "STAGE " + stage.getName() + EOL);
    context.stage = stage;

    var stageNode = stage.getStageNode();
    var nodesVisited = {};

    function visitNode(node, ident) {
        if (nodesVisited[node.getId()]) {
            return;
        }
        if (isNodeWillBeDumped(node, nodesVisited))
            ident += IDENT;
        nodesVisited[node.getId()] = true;

        nodeDump(node, ident);
        $.each(node.getOutConds(), function(key, cond) {
            condDump(cond, ident, nodesVisited);
            if (isNodeWillBeDumped(node, nodesVisited))
                ident += 2; //"|__"
            visitNode(cond.getDstNode(), ident);
            if (isNodeWillBeDumped(node, nodesVisited))
                ident -= 2;
        });

        if (isNodeWillBeDumped(node, nodesVisited))
            ident -= IDENT;
    }
    visitNode(stageNode, 0);
}

function scriptDump(script) {
    dump("Script "
        + script.getName() + EOL
        + "Stages:" + EOL);
    $.each(script.getStages(), function(key, stage) {
        stageDump(stage);
    });
}

(function main() {
    var scriptFilePath = process.argv[2];
    if (!scriptFilePath) {
        console.error("Please supply quest script file as the first argument");
    }

    console.log("Processing file '" + scriptFilePath + "'");

    var scriptFileContents = fs.readFileSync(scriptFilePath, { encoding : 'utf8' });
    var scriptSaved = JSON.parse(scriptFileContents);
    var script = loadQuestScript(scriptSaved);
    if (!script) {
        console.error("Couldn't load quest script from file " + scriptFilePath);
        console.log("Script file contents: ");
        console.log(scriptFileContents);
    }
    console.log("Script '" + script.getName() + "' is loaded");

    scriptDump(script);
})();
