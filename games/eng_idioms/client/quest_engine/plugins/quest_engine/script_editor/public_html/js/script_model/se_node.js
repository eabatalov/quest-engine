function SENode(type) {
    this.id = SENode.idCnt++;
    this.type = type;
    this.label = "";
    this.continue = false;
    this.inConds = [];
    this.outConds = [];
    this.deleted = false;
    //Public node type dependent data is stored in props
    this.props = {};

    this.events = {
        inCondAdded : new SEEvent(), /* function(cond) */
        inCondDeleted : new SEEvent(), /* function(cond) */
        outCondAdded : new SEEvent(), /* function(cond) */
        outCondDeleted : new SEEvent(), /* function(cond) */
        labelChanged : new SEEvent(), /* function() */
        propChanged : new SEEvent() /* function(propName) */
    };

    SENode.events.nodeCreated.publish(this);
}

SENode.idCnt = 0;
SENode.events = {
    nodeCreated : new SEEvent(), /* function(node) */
    nodeDeleted : new SEEvent() /* function(node) */
};

SENode.prototype.save = function() {
    function idCb(cond, ix) { return cond.getId(); };
    return {
        ver : 1,
        id: this.id,
        type : this.type,
        label : this.label,
        continue : this.continue,
        inCondIds : $.map(this.inConds, idCb),
        outCondIds : $.map(this.outConds, idCb),
        props : this.props
    };
};

SENode.loadConds = function(condIds, allConds, isInConds) {
    var conds = $.map(condIds, function(id) {
        return $.grep(allConds, function(cond) { return cond.getId() === id; })[0];
    });
    $.each(conds, function(ix, cond) {
        if (isInConds)
            cond.setDstNode(this);    
        else
            cond.setSrcNode(this);
    });
    return conds;
};

SENode.load = function(savedData, allConds) {
    assert(savedData.ver === 1);
    SENode.idCnt = Math.max(SENode.idCnt, savedData.id + 1);

    var node = new SENode();
    node.id = savedData.id;
    node.type = savedData.type;
    node.label = savedData.label;
    node.continue = savedData.continue;
    node.inConds = SENode.loadConds(savedData.inCondIds, allConds, true);
    node.outConds = SENode.loadConds(savedData.outCondIds, allConds, false);
    node.props = savedData.props;
    return node;
};

SENode.prototype.getId = function() {
    return this.id;
};

SENode.prototype.getType = function() {
    return this.type;
};

SENode.prototype.getLabel = function() {
    return this.label;
};

SENode.prototype.setLabel = function(val) {
    this.label = val;
    this.events.labelChanged.publish();
};

SENode.prototype.setProp = function(name, value) {
    this.props[name] = value;
    this.events.propChanged.publish(name);
};

SENode.prototype.getProps = function() {
    return this.props;
};

SENode.prototype.getContinue = function() {
    return this.continue;
};

SENode.prototype.setContinue = function(val) {
    this.continue = val;
};

SENode.prototype.getInConds = function() {
    return this.inConds;
}

SENode.prototype.addInCond = function(cond) {
    this.inConds.push(cond);
    cond.setDstNode(this);
    this.events.inCondAdded.publish(cond);
};

SENode.prototype.deleteInCond = function(delCond) {
    for (i = 0; i < this.inConds.length; ++i) {
        var cond = this.inConds[i];
        if (cond.getId() == delCond.getId()) {
            this.inConds.splice(i, 1);
            this.events.inCondDeleted.publish(cond);
            cond.delete();
            return;
        }
    }
};

SENode.prototype.getOutConds = function() {
    return this.outConds;
}

SENode.prototype.addOutCond = function(cond) {
    this.outConds.push(cond);
    cond.setSrcNode(this);
    this.events.outCondAdded.publish(cond);
};

SENode.prototype.deleteOutCond = function(delCond) {
    for (i = 0; i < this.outConds.length; ++i) {
        var cond = this.outConds[i];
        if (cond.getId() == delCond.getId()) {
            this.outConds.splice(i, 1);
            this.events.outCondDeleted.publish(cond);
            cond.delete();
            return;
        }
    }
};

SENode.prototype.delete = function() {
    if (!this.deleted) {
        //Use "deleted" flag to break cascade deletion chains
        this.deleted = true;
        while (this.inConds.length > 0) {
            this.deleteInCond(this.inConds[0])
        }
        while (this.outConds.length > 0) {
            this.deleteOutCond(this.outConds[0])
        }
        this.inConds = null;
        this.outConds = null;
        SENode.events.nodeDeleted.publish(this);
    }
};

// ============ STAGE ============
function SEStageNode() {
    SENode.call(this, _QUEST_NODES.STAGE);
    this.props.name = "";
    this.props.objs = [];
    this.props.objPool = [];
}

SEStageNode.prototype = new SENode(_QUEST_NODES.STAGE);

SEStageNode.prototype.addObject = function(objId) {
    this.props.objs.push(objId);
    this.props.objPool.push(objId);
};

SEStageNode.prototype.takeFromPool = function(objId) {
    this.props.objPool.remove(objId);
};

// ============ STORYLINE ============
function SEStorylineNode() {
    SENode.call(this, _QUEST_NODES.STORYLINE);
    this.props.objs = [];
}

SEStorylineNode.prototype = new SENode(_QUEST_NODES.STORYLINE);

SEStorylineNode.prototype.addObject = function(objId, stageNode) {
    this.props.objs.push(objId);
    stageNode.takeFromPool(objId);
};

SEStorylineNode.prototype.addInCond = function(cond) {
    SENode.prototype.addInCond.call(this, cond);
};

SEStorylineNode.prototype.deleteInCond = function(delCond) {
    SENode.prototype.deleteInCond.call(this, delCond);
};

// ============ NONE ============
function SENoneNode() {
    SENode.call(this, _QUEST_NODES.NONE);
}

SENoneNode.prototype = new SENode(_QUEST_NODES.NONE);

// ============ PHRASE ============
function SEPhraseNode() {
    SENode.call(this, _QUEST_NODES.PHRASE);
    this.props.id = "";
    this.props.text = "";
    this.props.phraseType = _UI_PHRASE_TYPES.SPEAK;

}

SEPhraseNode.prototype = new SENode(_QUEST_NODES.PHRASE);

// ============ QUIZ  ============
function SEQuizNode() {
    SENode.call(this, _QUEST_NODES.QUIZ);
    this.props.id = "";
    this.props.text = "";
    this.props.phraseType = _UI_PHRASE_TYPES.SPEAK;
    this.props.ans1 = "";
    this.props.ans2 = "";
    this.props.ans3 = "";
    this.props.ans4 = "";
}

SEQuizNode.prototype = new SENode(_QUEST_NODES.QUIZ);

// ============ ANIM  ============
function SEAnimNode() {
    SENode.call(this, _QUEST_NODES.ANIM);
    this.props.id = "";
    this.props.name = "";
}

SEAnimNode.prototype = new SENode(_QUEST_NODES.ANIM);

// ============ WAIT  ============
function SEWaitNode() {
    SENode.call(this, _QUEST_NODES.WAIT);
    this.props.secs = "0";
}

SEWaitNode.prototype = new SENode(_QUEST_NODES.WAIT);

// ============ STAGE_CLEAR  ============
function SEStageClearNode() {
    SENode.call(this, _QUEST_NODES.STAGE_CLEAR);
}

SEStageClearNode.prototype = new SENode(_QUEST_NODES.STAGE_CLEAR);

// ============ COMMON  ============
function SENodeFabric(nodeType) {
    switch(nodeType) {
        case _QUEST_NODES.NONE:
            return new SENoneNode();
        break;
        case _QUEST_NODES.PHRASE:
            return new SEPhraseNode();
        break;
        case _QUEST_NODES.QUIZ:
            return new SEQuizNode();
        break;
        case _QUEST_NODES.ANIM:
            return new SEAnimNode();
        break;
        case _QUEST_NODES.WAIT:
            return new SEWaitNode();
        break;
        case _QUEST_NODES.STAGE_CLEAR:
            return new SEStageClearNode();
        break;
        case _QUEST_NODES.STORYLINE:
            return new SEStorylineNode();
        break;
        case _QUEST_NODES.STAGE:
            return new SEStageNode();
        break;
    }
}
