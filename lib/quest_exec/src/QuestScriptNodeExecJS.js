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
    var funcName = env.isRollbackExec ?
        node.getProp("rollbackName") : node.getProp('name');
    assert(funcName);
    assert(node.getProp('source') === SEFuncCallNode.sources.js);

    //Put params in according to js api calling convention
    var params = {};
    jQuery.each(node.getProp('params'), function(ix, param) {
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

    window[funcName](params);
};
