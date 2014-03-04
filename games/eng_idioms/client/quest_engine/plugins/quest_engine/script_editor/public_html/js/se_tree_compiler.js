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

TreeCompiler.prototype.OBJ_TYPE = {
	NODE : 1,
	COND : 2
};

TreeCompiler.prototype.compile = function() {
    var idSeq = 0;
    this.objDatas = {};

    $.each(this.treeEditor.nodes.all, function(ix, node) {
        idSeq += 1;
        this.objDatas[idSeq] = {
            obj: node,
            type : this.OBJ_TYPE.NODE,
            id : idSeq
        };
    }.bind(this));
    $.each(this.treeEditor.conds, function(ix, cond) {
        idSeq += 1;
        this.objDatas[idSeq] = {
            obj: cond,
            type : this.OBJ_TYPE.COND,
            id : idSeq
        };
    }.bind(this));
    return this.generateCode();
};

TreeCompiler.prototype.generateCode = function() {
    $.each(this.objDatas, function(id, objData) {
        this.generateDeclaration(objData);
    }.bind(this));
    $.each(this.objDatas, function(id, objData) {
        this.gatherChildren(objData, this.objDatas);
        this.generateChildInit(objData);
    }.bind(this));
    return this.outputCode(this.objDatas);
};

TreeCompiler.prototype.outputCode = function() {
    var code = "function getQuestScript() {\r\n";
    $.each(this.objDatas, function(id, objData) {
        code += objData.decl
            + "\r\n";
    }.bind(this));
    $.each(this.objDatas, function(id, objData) {
        code += objData.childInit
            + "\r\n";
    }.bind(this));

    var stageObjectData = null;
    $.each(this.objDatas, function(id, objData) {
        if (objData.type === this.OBJ_TYPE.NODE && objData.obj.type === _QUEST_NODE_STAGE) {
            stageObjectData = objData;
            return false;
        }
    }.bind(this));
    code += "return new QuestScript([" + stageObjectData.varName + "]);\r\n";
    code += "}";

    return code;
};

TreeCompiler.prototype.gatherChildren = function(objData) {
    objData.children = [];
	var OBJ_EXTRA_HIT_SIZE_PX = 5;

    $.each(this.objDatas, function(id, objDataChild) {
        if (objDataChild.id === objData.id)
            return;
        if (objData.type === this.OBJ_TYPE.NODE) {
            if (objDataChild.type !== this.OBJ_TYPE.COND)
                return;
            var objHitArea = new PIXI.Rectangle(
                objData.obj.x - OBJ_EXTRA_HIT_SIZE_PX,
                objData.obj.y - OBJ_EXTRA_HIT_SIZE_PX,
                objData.obj.width + OBJ_EXTRA_HIT_SIZE_PX,
                objData.obj.height + OBJ_EXTRA_HIT_SIZE_PX);
            if (!objHitArea.contains(
                    objDataChild.obj.points.src.x,
                    objDataChild.obj.points.src.y))
                return;
        } else if (objData.type === this.OBJ_TYPE.COND) {
            if (objDataChild.type !== this.OBJ_TYPE.NODE)
                return;
            var objHitArea = new PIXI.Rectangle(
                objDataChild.obj.x - OBJ_EXTRA_HIT_SIZE_PX,
                objDataChild.obj.y - OBJ_EXTRA_HIT_SIZE_PX,
                objDataChild.obj.width + OBJ_EXTRA_HIT_SIZE_PX,
                objDataChild.obj.height + OBJ_EXTRA_HIT_SIZE_PX);
            if (!objHitArea.contains(
                    objData.obj.points.dst.x,
                    objData.obj.points.dst.y))
                return;
        }
        objData.children.push(objDataChild);
    }.bind(this));
};

TreeCompiler.prototype.genNodeCreationCode = function(node) {
    var code = "new QuestNode("
        + this.jsIntConst(node.type) + ", "
        + this.jsBoolConst(node.continue) + ", ";
    switch(node.type) {
        case _QUEST_NODE_NONE:
            code += "null";
        break;
        case _QUEST_NODE_PHRASE:
            code += "{ "
                + "id : " + this.jsStringConst(node.props.id)
                + ", text : " + this.jsStringConst(node.props.text)
                + " }";
        break;
        case _QUEST_NODE_QUIZ:
            code += "{ "
                + "id : " + this.jsStringConst(node.props.id)
                + ", text : " + this.jsStringConst(node.props.text)
                + ", ans : ["
                    + this.jsStringConst(node.props.ans1)
                    + ", " + this.jsStringConst(node.props.ans2)
                    + ", " + this.jsStringConst(node.props.ans3)
                    + ", " + this.jsStringConst(node.props.ans4)
                + "]"
                + " }";
        break;
        case _QUEST_NODE_ANIM:
            code += "{ "
                + "id : " + this.jsStringConst(node.props.id)
                + ", name : " + this.jsStringConst(node.props.name)
                + " }";
        break;
        case _QUEST_NODE_WAIT:
            code += "{ "
                + "secs : " + this.jsIntConst(node.props.secs)
                + " }";
        break;
        case _QUEST_NODE_STAGE_CLEAR:
            code += "null";
        break;
        case _QUEST_NODE_STORYLINE:
            code += "{ "
                + "objs : " + this.jsArrayConst(node.props.objs, "string")
                + " }";
        break;
        case _QUEST_NODE_STAGE:
            code += "{ "
                + "name : " + this.jsStringConst(node.props.name)
                + " }";
        break;
    }
    code += ", [])";
    return code;
};

TreeCompiler.prototype.genCondCreationCode = function(cond) {
    var code = "new QuestCond("
        + this.jsIntConst(cond.type) + ", ";
    switch(cond.type) {
        case _QUEST_COND_OBJECT_CLICKED:
            code += "{ id : " + this.jsStringConst(cond.props.id) + " }";
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
};

TreeCompiler.prototype.generateDeclaration = function(objData) {
    objData.varName = (objData.type === this.OBJ_TYPE.NODE ? "node" : "cond")
        + objData.id.toString();
    objData.decl = objData.varName + " = "
        + (objData.type === this.OBJ_TYPE.NODE ?
            this.genNodeCreationCode(objData.obj) :
            this.genCondCreationCode(objData.obj))
        + ";\n";
};

TreeCompiler.prototype.generateChildInit = function(objData) {
    objData.childInit = "";
    $.each(objData.children, function(ix, objDataChild) {
        objData.childInit +=
            "//" + this.jsIntConst(objData.id) + " -> " + this.jsIntConst(objDataChild.id) + ";\r\n";
        if (objData.type === this.OBJ_TYPE.NODE) {
            objData.childInit += objData.varName + ".conds.push(" + objDataChild.varName + ")"
                + ";\r\n";
        } else if (objData.type === this.OBJ_TYPE.COND) {
            objData.childInit += objData.varName + ".node = " + objDataChild.varName
                + ";\r\n";
        }
    }.bind(this));
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
TreeCompiler.prototype.jsStringConst = function(val) {
	if (typeof val === 'string' || val instanceof String)
    	return JSON.stringify(val);

	throw new CompilationInternalError((typeof val) + " was passed as string constant");
};

TreeCompiler.prototype.jsIntConst = function(val) {
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
};

TreeCompiler.prototype.jsBoolConst = function(val) {
	if (val === true)
		return "true";
	else if (val === false)
		return false;
	else
		throw new CompilationInternalError(val.toString() + " was passed as boolean constant");
};

/* jsArrayConst should be avoided because it doesn't control which elements of array are dumped */
TreeCompiler.prototype.jsArrayConst = function(vals, elemType) {
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
};

function TreeCompilerFactory(scope, treeEditor, seEvents) {
    return new TreeCompiler(scope, treeEditor, seEvents);
}
