QuestRuntime.prototype.jsFuncNodeExec = function(node) {
    assert(node.getProp('source') === SEFuncCallNode.sources.js);
    var funcName = node.getProp('name');
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
