function QuestScriptNodeExecJSEnv() {
    //Default env
    this.isRollbackExec = false;
}

function QuestScriptNodeExecJS() {

}

QuestScriptNodeExecJS.prototype.exec = function(node, env) {

    if (node.getType() === _QUEST_NODES.FUNC_CALL &&
        node.getProp('source') === SEFuncCallNode.sources.js) {
        this.jsFuncNodeExec(node, env);
        return true;
    }

    return false;
};

QuestScriptNodeExecJS.prototype.jsFuncNodeExec = function(node, env) {
    this.jsFuncExec(node.getProp('name'),
        node.getProp('source'), node.getProp('params'), env);
};

QuestScriptNodeExecJS.prototype.jsFuncExec =
function(name, source, paramsFuncNode, env) {
    assert(name);
    assert(source === SEFuncCallNode.sources.js);

    //Put func params according to js api calling convention
    var params = {};
    jQuery.each(paramsFuncNode, function(ix, param) {
        var value = param.value;
        if (param.type === SEFuncCallNodeParameter.types.num) {
            if (value.indexOf(".") !== -1) {
                value = parseInt(value, 10);
            } else {
                value = parseFloat(value);
            }
        }
        params[param.name] = value;
    });

    window[name](params);
};
