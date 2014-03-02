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
                + "id : " + toJSString(node.props.id)
                + ", text : " + toJSString(node.props.text)
                + " }";
        break;
        case _QUEST_NODE_QUIZ:
            code += "{ "
                + "id : " + toJSString(node.props.id)
                + ", text : " + toJSString(node.props.text)
                + ", ans : ["
                    + toJSString(node.props.ans1)
                    + ", " + toJSString(node.props.ans2)
                    + ", " + toJSString(node.props.ans3)
                    + ", " + toJSString(node.props.ans4)
                + "]"
                + " }";
        break;
        case _QUEST_NODE_ANIM:
            code += "{ "
                + "id : " + toJSString(node.props.id)
                + ", name : " + toJSString(node.props.name)
                + " }";
        break;
        case _QUEST_NODE_WAIT:
            code += "{ "
                + "secs : " + toJSInt(node.props.secs)
                + " }";
        break;
        case _QUEST_NODE_STAGE_CLEAR:
            code += toJSString(null);
        break;
        case _QUEST_NODE_STORYLINE:
            code += "{ "
                + "objs : " + toJSString(node.props.objs)
                + " }";
        break;
        case _QUEST_NODE_STAGE:
            code += "{ "
                + "name : " + toJSString(node.props.name)
                + " }";
        break;
    }
    code += ", [])";
    return code;
}

function genCondCreationCode(cond) {
    var code = "new QuestCond("
        + toJSString(cond.type) + ", ";
    switch(cond.type) {
        case _QUEST_COND_OBJECT_CLICKED:
            code += "{ id : " + toJSString(cond.props.id) + " }";
        break;
        case _QUEST_COND_NONE:
        case _QUEST_COND_ANSWER_1_CLICKED:
        case _QUEST_COND_ANSWER_2_CLICKED:
        case _QUEST_COND_ANSWER_3_CLICKED:
        case _QUEST_COND_ANSWER_4_CLICKED:
        case _QUEST_COND_ANSWER_OTHER_CLICKED:
        case _QUEST_COND_CONTINUE:
        case _QUEST_COND_DEFAULT:
            code += toJSString(null);
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
            "//" + toJSString(objData.id) + " -> " + toJSString(objDataChild.id) + ";\r\n";
        if (objData.type === _TYPE_NODE) {
            objData.childInit += objData.varName + ".conds.push(" + objDataChild.varName + ")"
                + ";\r\n";
        } else if (objData.type === _TYPE_COND) {
            objData.childInit += objData.varName + ".node = " + objDataChild.varName
                + ";\r\n";
        }
    });
};

function CompilationError(descr)
{
    this.descr = descr;
}

function toJSString(val) {
    return JSON.stringify(val);
}

function toJSInt(val) {
    var intRegex = /^\d+$/;
    if(intRegex.test(val)) {
       return val;
    } else {
        throw new CompilationError(val.toString() + " should have integer value");
    }
}

function TreeCompilerFactory(scope, treeEditor, seEvents) {
    return new TreeCompiler(scope, treeEditor, seEvents);
}