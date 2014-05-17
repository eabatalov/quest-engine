/* ==== INSTALLER ==== */
function CondTypeValidator(script) {
    this.script = script;
    this.events = {
        validTypeListChanged : new SEEvent(), /* function(cond) */
        condTypeValidityChanged : new SEEvent() /* function(cond, bool validity) */
    };
    this.stageFilters = {};
    jQuery.each(script.getStages(), function(ix, stage) {
        this.installToStage(stage);
    }.bind(this));
    this.eventHandlers = [
        this.script.events.stageAdded.subscribe(this, this.installToStage),
        this.script.events.stageDeleted.subscribe(this, this.uninstallFromStage)
    ];
}

CondTypeValidator.prototype.delete = function() {
    jQuery.each(this.eventHandlers, collectionObjectDelete);
    delete this.eventHandlers;
    delete this.script;
    jQuery.each(this.stageFilters, collectionObjectDelete);
    delete this.stageFilters;
    jQuery.each(this.events, collectionObjectDelete);
    delete this.events;
};

CondTypeValidator.StageFilterInfo = function(stageFilter, handlers) {
    this.stageFilter = stageFilter;
    this.handlers = handlers;
};

CondTypeValidator.StageFilterInfo.prototype.delete = function() {
    jQuery.each(this.handlers, collectionObjectDelete);
    delete this.handlers;
    this.stageFilter.delete();
    delete this.stageFilter;
};

CondTypeValidator.prototype.installToStage = function(stage) {
    var stageFilter = new StageCondTypeValidator(stage);
    var filterInfo = new CondTypeValidator.StageFilterInfo(
        stageFilter,
        [
            stageFilter.events.validTypeListChanged.subscribe(this, this.validTypeListChanged),
            stageFilter.events.condTypeValidityChanged.subscribe(this, this.condTypeValidityChanged)
        ]
    );
    this.stageFilters[stage.getId()] = filterInfo;
    return stageFilter;
};

CondTypeValidator.prototype.uninstallFromStage = function(stage) {
    var filterInfo = this.stageFilters[stage.getId()];
    delete this.stageFilters[stage.getId()];
    filterInfo.delete();
};

CondTypeValidator.prototype.validTypeListChanged = function(cond) {
    this.events.validTypeListChanged.publish(cond);
};

CondTypeValidator.prototype.condTypeValidityChanged = function(cond, validity) {
    this.events.condTypeValidityChanged.publish(cond, validity);
};

CondTypeValidator.typeLists = {
    simple : [
        _QUEST_CONDS.NONE,
        _QUEST_CONDS.OBJECT_CLICKED,
        _QUEST_CONDS.DEFAULT,
        _QUEST_CONDS.CUSTOM_EVENT,
        _QUEST_CONDS.NEXT
    ],
    quiz : [
        _QUEST_CONDS.NONE,
        _QUEST_CONDS.OBJECT_CLICKED,
        _QUEST_CONDS.DEFAULT,
        _QUEST_CONDS.ANSWER_1_CLICKED,
        _QUEST_CONDS.ANSWER_2_CLICKED,
        _QUEST_CONDS.ANSWER_3_CLICKED,
        _QUEST_CONDS.ANSWER_4_CLICKED,
        _QUEST_CONDS.ANSWER_OTHER_CLICKED,
        _QUEST_CONDS.CUSTOM_EVENT,
        _QUEST_CONDS.NEXT
    ],
    stage : [
        _QUEST_CONDS.NONE
    ],
    continue : [
        _QUEST_CONDS.CONTINUE
    ]
};

CondTypeValidator.getValidCondTypes = function(cond) {
    var srcNode = cond.getSrcNode();

    if (!srcNode)
        return [];

    if (srcNode.getType() === _QUEST_NODES.STAGE)
        return CondTypeValidator.typeLists.stage;

    if (srcNode.continue)
        return CondTypeValidator.typeLists.continue;

    switch(srcNode.getType()) {
        case _QUEST_NODES.NONE:
        case _QUEST_NODES.PHRASE:
        case _QUEST_NODES.ANIM:
        case _QUEST_NODES.STAGE_CLEAR:
	    case _QUEST_NODES.STORYLINE:
	    case _QUEST_NODES.WAIT:
	    case _QUEST_NODES.NOTIFICATION:
            return CondTypeValidator.typeLists.simple;
        case _QUEST_NODES.QUIZ:
            return CondTypeValidator.typeLists.quiz;
        default:
            return [];
    }
};

CondTypeValidator.prototype.getValidCondTypes = CondTypeValidator.getValidCondTypes;

/* ==== StageCondTypeValidator ==== */
function StageCondTypeValidator(stage) {
    this.stage = stage;
    this.stage.__contTypeFIlter = this;
    this.events = {
        validTypeListChanged : new SEEvent(), /* function(cond) */
        condTypeValidityChanged : new SEEvent() /* function(cond, bool validity) */
    };

    this.evHandlers = [
        this.stage.events.nodeCreated.subscribe(this, this.subscribeNodeEvents),
        this.stage.events.nodeDeleted.subscribe(this, this.unsubscribeNodeEvents),
        this.stage.events.condCreated.subscribe(this, this.condCreated),
        this.stage.events.condDeleted.subscribe(this, this.condDeleted),
        this.events.validTypeListChanged.subscribe(this, this.validateCondType)
    ];
    this.nodeEHs = new ObjectMap();
    this.condEHs = new ObjectMap();

    jQuery.each(this.stage.getNodes(), function(ix, node) {
        this.subscribeNodeEvents(node)
    }.bind(this));
    jQuery.each(this.stage.getConds(), function(ix, cond) {
        this.subscribeCondEvents(cond)
    }.bind(this));
}

StageCondTypeValidator.fromStage = function(stage) {
    return stage.__contTypeFIlter;
};

StageCondTypeValidator.prototype.delete = function() {
    delete this.stage.__contTypeFIlter;
    delete this.stage;
    jQuery.each(this.events, collectionObjectDelete);
    delete this.events;
    jQuery.each(this.evHandlers, collectionObjectDelete);
    delete this.evHandlers;
    this.nodeEHs.each(collectionListOfObjectsDelete);
    delete this.nodeEHs;
    this.condEHs.each(collectionListOfObjectsDelete);
    delete this.condEHs;
};

StageCondTypeValidator.prototype.subscribeNodeEvents = function(node) {
    this.nodeEHs.put(
        node, [
            node.events.continueChanged.subscribe(this, this.nodeContinueChanged)
        ]
    );
}

StageCondTypeValidator.prototype.unsubscribeNodeEvents = function(node) {
    var evHandlers = this.nodeEHs.get(node);
    jQuery.each(evHandlers, collectionObjectDelete);
    this.nodeEHs.remove(node);
};

StageCondTypeValidator.prototype.condCreated = function(cond) {
    this.subscribeCondEvents(cond);
    this.events.validTypeListChanged.publish(cond);
};

StageCondTypeValidator.prototype.subscribeCondEvents = function(cond) {
    this.condEHs.put(
        cond, [
            cond.events.typeChanged.subscribe(this, function(cond) {
                this.events.validTypeListChanged.publish(cond);
            }, this),
            cond.events.srcNodeChanged.subscribe(this, function(cond) {
                this.events.validTypeListChanged.publish(cond);
            }, this)
        ]
    );
}

StageCondTypeValidator.prototype.condDeleted = function(cond) {
    this.unsubscribeCondEvents(cond);
    //Deleted object is always valid
    this.events.condTypeValidityChanged.publish(cond, true);
}

StageCondTypeValidator.prototype.unsubscribeCondEvents = function(cond) {
    var evHandlers = this.condEHs.get(cond);
    jQuery.each(evHandlers, collectionObjectDelete);
    this.condEHs.remove(cond);
};

StageCondTypeValidator.prototype.nodeContinueChanged = function(node) {
    for (var i = 0; i < node.getOutConds().length; ++i) {
        var outCond = node.getOutConds()[i];
        this.events.validTypeListChanged.publish(outCond);
    }
};

StageCondTypeValidator.prototype.validateCondType = function(cond) {
    var condAllowedTypes = CondTypeValidator.getValidCondTypes(cond);
    var isCondTypeValid = condAllowedTypes.indexOf(cond.getType()) > -1;
    this.events.condTypeValidityChanged.publish(cond, isCondTypeValid);
};
