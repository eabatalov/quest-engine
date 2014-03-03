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
	saveAs(scriptAsBlob, "story.js");
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
        + toJSInt(node.type) + ", "
        + toJSBool(node.continue) + ", ";
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
            code += "null";
        break;
        case _QUEST_NODE_STORYLINE:
            code += "{ "
                + "objs : " + toJSArray(node.props.objs, "string")
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
        + toJSInt(cond.type) + ", ";
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
            "//" + toJSInt(objData.id) + " -> " + toJSInt(objDataChild.id) + ";\r\n";
        if (objData.type === _TYPE_NODE) {
            objData.childInit += objData.varName + ".conds.push(" + objDataChild.varName + ")"
                + ";\r\n";
        } else if (objData.type === _TYPE_COND) {
            objData.childInit += objData.varName + ".node = " + objDataChild.varName
                + ";\r\n";
        }
    });
};

/* Because of user's invalid program */
function CompilationError(descr) {
    this.descr = descr;
}

/* Because of our coding mistake */
function CompilationInternalError(descr) {
    this.descr = descr;
}

/* Convertors of JS var values to JS source constants */
function toJSString(val) {
	if (typeof val === 'string' || val instanceof String)
    	return JSON.stringify(val);

	throw new CompilationInternalError((typeof val) + " was passed as string constant");
}

function toJSInt(val) {
	if (typeof val === 'number')
		val = val.toString();

	if (typeof val === 'string' || val instanceof String) {
		var intRegex = /^-?\d+$/;
		if(intRegex.test(val))
			return val;
		else throw new CompilationError(val.toString() + " should have integer value");
	} else {
		throw new CompilationInternalError((typeof val) + " was passed as int constant");
	}
}

function toJSBool(val) {
	if (val === true)
		return "true";
	else if (val === false)
		return false;
	else
		throw new CompilationInternalError(val.toString() + " was passed as boolean constant");
}
/* toJSArray should be avoided because it doesn't control which elements of array are dumped */
function toJSArray(vals, elemType) {
	if ($.isArray(vals)) {
		if (elemType !== undefined) {
			$.each(vals, function(ix, val) {
				if (typeof val !== elemType)
					throw new CompilationInternalError("Element of array " + val.toString() + " should have type " + elemType
						+ "but has type " + typeof val);
			});
		}
		return JSON.stringify(vals);
	} else throw new CompilationInternalError((typeof val) + " was passed as array constant");
}

function TreeCompilerFactory(scope, treeEditor, seEvents) {
    return new TreeCompiler(scope, treeEditor, seEvents);
}
