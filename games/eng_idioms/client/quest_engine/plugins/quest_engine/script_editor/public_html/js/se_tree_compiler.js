function TreeCompiler(scope, treeEditor, seEvents) {
    this.treeEditor = treeEditor;
    this.seEvents = seEvents;
    scope.$on('seEvent', this.onSeEvent.bind(this));
}

TreeCompiler.prototype.onSeEvent = function() {
    if (this.seEvents.args.name !== "COMPILE")
        return;

    this.uploadCompiledScript(this.compile());
};

TreeCompiler.prototype.uploadCompiledScript = function(scriptText) {
    var scriptAsBlob = new Blob([scriptText], { type : 'text/javascript' });

    var downloadLink = document.createElement("a");
    downloadLink.download = "story.js";
    downloadLink.innerHTML = "Download Story";
    if (window.webkitURL !== null)
    {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(scriptAsBlob);
    }
    else
    {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(scriptAsBlob);
            downloadLink.onclick = this.destroyClickedScriptLink;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
    }

    downloadLink.click();
};

TreeCompiler.prototype.destroyClickedScriptLink = function(event) {
	document.body.removeChild(event.target);
};

_TYPE_NODE = 1;
_TYPE_COND = 2;

TreeCompiler.prototype.compile = function() {
    var idSeq = 0;
    var objDatas = {};

    $.each(this.treeEditor.nodes.all, function(ix, node) {
        idSeq += 1;
        objDatas[idSeq] = {
            obj: node,
            type : _TYPE_NODE,
            id : idSeq
        };
    }.bind(this));
    $.each(this.treeEditor.conds, function(ix, cond) {
        idSeq += 1;
        objDatas[idSeq] = {
            obj: cond,
            type : _TYPE_COND,
            id : idSeq
        };
    }.bind(this));
    return this.generateCode(objDatas);
};

TreeCompiler.prototype.generateCode = function(objDatas) {
    $.each(objDatas, function(id, objData) {
        this.generateDeclaration(objData);
    }.bind(this));
    $.each(objDatas, function(id, objData) {
        this.gatherChildren(objData, objDatas);
        this.generateChildInit(objData);
    }.bind(this));
    return this.outputCode(objDatas);
};

TreeCompiler.prototype.outputCode = function(objDatas) {
    var code = "function getQuestScript() {\r\n";
    $.each(objDatas, function(id, objData) {
        code += objData.decl
            + "\r\n";
    }.bind(this));
    $.each(objDatas, function(id, objData) {
        code += objData.childInit
            + "\r\n";
    }.bind(this));

    var stageObjectData = null;
    $.each(objDatas, function(id, objData) {
        if (objData.type === _TYPE_NODE && objData.obj.type === _QUEST_NODE_STAGE) {
            stageObjectData = objData;
            return false;
        }
    }.bind(this));
    code += "return new QuestScript([" + stageObjectData.varName + "]);\r\n";
    code += "}";

    return code;
};

TreeCompiler.prototype.gatherChildren = function(objData, objDatas) {
    objData.children = [];

    $.each(objDatas, function(id, objDataChild) {
        if (objDataChild.id === objData.id)
            return;
        if (objData.type === _TYPE_NODE) {
            if (objDataChild.type !== _TYPE_COND)
                return;
            var objHitArea = new PIXI.Rectangle(
                objData.obj.x - 5,
                objData.obj.y - 5,
                objData.obj.width + 5,
                objData.obj.height + 5);
            if (!objHitArea.contains(
                    objDataChild.obj.points.src.x,
                    objDataChild.obj.points.src.y))
                return;
        } else if (objData.type === _TYPE_COND) {
            if (objDataChild.type !== _TYPE_NODE)
                return;
            var objHitArea = new PIXI.Rectangle(
                objDataChild.obj.x - 5,
                objDataChild.obj.y - 5,
                objDataChild.obj.width + 5,
                objDataChild.obj.height + 5);
            if (!objHitArea.contains(
                    objData.obj.points.dst.x,
                    objData.obj.points.dst.y))
                return;
        }
        objData.children.push(objDataChild);
    }.bind(this));
};

function genNodeCreationCode(node) {
    var code = "new QuestNode("
        + node.type.toString() + ", "
        + node.continue.toString() + ", ";
    switch(node.type) {
        case _QUEST_NODE_NONE:
            code += "null";
        break;
        case _QUEST_NODE_PHRASE:
            code += "{ "
                + "id : '" + node.props.id.toString() + "'"
                + ", text : '" + node.props.text.toString() + "'"
                + " }";
        break;
        case _QUEST_NODE_QUIZ:
            code += "{ "
                + "id : '" + node.props.id.toString() + "'"
                + ", text : '" + node.props.text.toString() + "'"
                + ", ans : ["
                    + "'" + node.props.ans1.toString() + "'"
                    + ", '" + node.props.ans2.toString() + "'"
                    + ", '" + node.props.ans3.toString() + "'"
                    + ", '" + node.props.ans4.toString() + "'"
                + "]"
                + " }";
        break;
        case _QUEST_NODE_ANIM:
            code += "{ "
                + "id : '" + node.props.id.toString() + "'"
                + ", name : '" + node.props.name.toString() + "'"
                + " }";
        break;
        case _QUEST_NODE_WAIT:
            code += "{ "
                + "secs : " + node.props.secs.toString()
                + " }";
        break;
        case _QUEST_NODE_STAGE_CLEAR:
            code += "null";
        break;
        case _QUEST_NODE_STORYLINE:
            code += "{ "
                + "objs : " + JSON.stringify(node.props.objs)
                + " }";
        break;
        case _QUEST_NODE_STAGE:
            code += "{ "
                + "name : '" + node.props.name.toString() + "'"
                + " }";
        break;
    }
    code += ", [])";
    return code;
}

function genCondCreationCode(cond) {
    var code = "new QuestCond("
        + cond.type.toString() + ", ";
    switch(cond.type) {
        case _QUEST_COND_OBJECT_CLICKED:
            code += "{ id : '" + cond.props.id + "' }";
        break;
        case _QUEST_COND_NONE:
        case _QUEST_COND_ANSWER_1_CLICKED:
        case _QUEST_COND_ANSWER_2_CLICKED:
        case _QUEST_COND_ANSWER_3_CLICKED:
        case _QUEST_COND_ANSWER_4_CLICKED:
        case _QUEST_COND_ANSWER_OTHER_CLICKED:
        case _QUEST_COND_CONTINUE:
        case _QUEST_COND_DEFAULT:
            code += "null";
        break;
    }
    code += ", null)";
    return code;
}

TreeCompiler.prototype.generateDeclaration = function(objData) {
    objData.varName = (objData.type === _TYPE_NODE ? "node" : "cond")
        + objData.id.toString();
    objData.decl = objData.varName + " = "
        + (objData.type === _TYPE_NODE ? genNodeCreationCode(objData.obj) : genCondCreationCode(objData.obj))
        + ";\n";
};

TreeCompiler.prototype.generateChildInit = function(objData) {
    objData.childInit = "";
    $.each(objData.children, function(ix, objDataChild) {
        objData.childInit +=
            "//'" + objData.id.toString() + " -> " + objDataChild.id.toString() + "';\r\n";
        if (objData.type === _TYPE_NODE) {
            objData.childInit += objData.varName + ".conds.push(" + objDataChild.varName.toString() + ")"
                + ";\r\n";
        } else if (objData.type === _TYPE_COND) {
            objData.childInit += objData.varName + ".node = " + objDataChild.varName.toString()
                + ";\r\n";
        }
    });
};

function TreeCompilerFactory(scope, treeEditor, seEvents) {
    return new TreeCompiler(scope, treeEditor, seEvents);
}