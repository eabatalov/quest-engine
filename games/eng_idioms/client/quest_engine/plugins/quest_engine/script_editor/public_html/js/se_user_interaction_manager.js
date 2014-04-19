/*
 * If some part of editor doesn't know what to do in particular event
 * then it should signal it to SEInputManager. SEInputManager knows bout all
 * the high level user interactions occuring now.
 */

function SEInputManager(seEventRouter) {
    //Kickstart code should initiate first stage creation
    this.state = SEInputManager.STATES.STAGE_CREATION_WAIT;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.seEvents.on(this.procEvent, this);

    this.dragNode = null;
    this.activeTBNodeType = null;
}

SEInputManager.prototype.setState = function(newState) {
    if (this.state === newState)
        return;

    var onEnter = SEInputManager.STATE_ENTER[newState];
    if (onEnter)
        onEnter.call(this, this.state, newState);

    this.state = newState;
};

SEInputManager.prototype.procEvent = function(args) {
    //console.log("state: " + this.state + " event: " + args.name);
    var evName = args.name;
    SEInputManager.STATE_PROC[this.state].call(this, evName, args);
};


SEInputManager.prototype.procStateIgnoreAllEvents = function(evName, args) {
};

SEInputManager.prototype.procStateNone = function(evName, args) {
    if (evName === "TOOLBAR_ITEM_ACTIVATE_CLICK") {
        this.activeTBNodeType = args.type;
        this.setState(SEInputManager.STATES.WAIT_NODE_POSITIONING);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "TOOLBAR_ITEM_ACTIVATE", item : args.item });
        return;
    };

    if (evName === "NODE_DOWN") {
        this.dragNode = args.node;
        this.setState(SEInputManager.STATES.NODE_DRAG);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "NODE_DRAG", node : this.dragNode });
        return;
    }

    if (evName === "EDITOR_DOWN") {
        this.setState(SEInputManager.STATES.EDITOR_ALL_MOVE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "EDITOR_START_DRAG", intData : args.intData });
        return;
    }

    if (evName === "COND_DEL_CLICK") {
        this.setState(SEInputManager.STATES.COND_DELETE_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_DELETE", cond : args.cond });
        return;
    }

    if (evName === "NODE_DEL_CLICK") {
        this.setState(SEInputManager.STATES.NODE_DELETE_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "NODE_DELETE", node : args.node });
        return;
    }

    if (evName === "NODE_NEW_COND_CLICK") {
        this.dragCondSrcNode = args.node;
        this.setState(SEInputManager.STATES.COND_CREATION_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_CREATE_FROM_NODE", node : args.node });
        return;
    }

    if (evName === "COND_CLICK") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : args.cond, type : "COND" });
        return;
    };

    if (evName === "STAGE_NEW_CLICK") {
        this.setState(SEInputManager.STATES.STAGE_CREATION_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "NEW_STAGE" });
        return;
    }

    if (evName === "STAGE_CHANGE_CLICK") {
        this.setState(SEInputManager.STATES.STAGE_CHANGE_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "STAGE_CHANGE", fromStage : args.fromStage, toStage : args.toStage });
        return;
    }

    if (evName === "PROJECT_SAVE_CLICK") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PROJECT_SAVE"});
        return;
    }

    if (evName === "PROJECT_FILE_LOADED") {
        this.setState(SEInputManager.STATES.STAGE_CHANGE_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PROJECT_FILE_OPEN", json : args.json });
        return;
    }
};

// NONE -> WAIT_NODE_POSITIONING -> WAIT_NODE_CREATION -> NONE
SEInputManager.prototype.nodeCreationCancellHandler = function(evName, args) {
    if (evName === "TOOLBAR_ITEM_DEACTIVATE_CLICK") {
        this.activeTBNodeType = null;
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "TOOLBAR_ITEM_DEACTIVATE", item : args.item });
        return;
    }

    if (evName === "TOOLBAR_ITEM_ACTIVATE_CLICK") {
        this.activeTBNodeType = args.type;
        this.setState(SEInputManager.STATES.WAIT_NODE_POSITIONING);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "TOOLBAR_ITEM_ACTIVATE", item : args.item });
        return;
    }
};

SEInputManager.prototype.procStateWaitNodePositioning = function(evName, args) {
    if (evName === "EDITOR_CLICK") {
        this.setState(SEInputManager.STATES.WAIT_NODE_CREATION);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "NODE_CREATE", type : this.activeTBNodeType, intData : args.intData });
        return;
    }
    this.nodeCreationCancellHandler(evName, args);
};

SEInputManager.prototype.procStateWaitNodeCreation = function(evName, args) {
    if (evName === "NODE_CREATED") {
        this.activeTBNodeType = null;
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "TOOLBAR_ITEM_DEACTIVATE" });
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : args.node, type : "NODE" });
        return;
    }
    
    this.nodeCreationCancellHandler(evName, args);
};

//NONE -> NODE_DRAG -> NONE
SEInputManager.prototype.nodeDragCancellHandler = function(evName, args) {
};

SEInputManager.prototype.procStateNodeDrag = function(evName, args) {
    if (evName === "EDITOR_UP") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "NODE_END_DRAG", node : this.dragNode });
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : this.dragNode, type : "NODE" });
        this.dragNode = null;
        this.setState(SEInputManager.STATES.NONE);
        return;
    }
    this.nodeDragCancellHandler(evName, args);
};

//NONE -> EDITOR_ALL_MOVE -> NONE
SEInputManager.prototype.editorAllMoveCancellHandler = function() {
};

SEInputManager.prototype.procStateEditorAllMove = function(evName, args) {
    if (evName === "EDITOR_UP" || evName === "EDITOR_UP_OUTSIDE") {
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "EDITOR_END_DRAG" });
    }

    this.editorAllMoveCancellHandler(evName, args);
};

//NONE -> COND_CREATION_WAIT -> COND_DRAGGING -> NONE
SEInputManager.prototype.condCreationCancelHandler = function(evName, args) {
};

SEInputManager.prototype.procStateCondCreationWait = function(evName, args) {
    if (evName === "COND_CREATED") {
        this.dragCond = args.cond;
        this.setState(SEInputManager.STATES.COND_DRAGGING);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_START_DRAG", cond : args.cond });
        return;
    }

    this.condCreationCancelHandler(evName, args);
};

SEInputManager.prototype.procStateCondDragging = function(evName, args) {
    if (evName === "NODE_DOWN") {
        if (args.node.getId() !== this.dragCondSrcNode.getId()) {
            this.setState(SEInputManager.STATES.IGNORE_ALL_EVENTS);
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_END_DRAG" });
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_UNSNAP_TO_NODE", cond : this.dragCond, node : args.node });
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "NODE_ADD_IN_COND", cond : this.dragCond, node : args.node });
            //Enable this line to focus newely created condition if we decide to do it
            //this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : this.dragCond, type : "COND" });
            this.dragCond = null;
            this.dragCondSrcNode = null;
            this.setState(SEInputManager.STATES.NONE);
        }
        return;
    }

    if (evName === "EDITOR_UP") {
        this.setState(SEInputManager.STATES.IGNORE_ALL_EVENTS);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_END_DRAG" });
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_DELETE", cond : this.dragCond });
        this.dragCond = null;
        this.dragCondSrcNode = null;
        this.setState(SEInputManager.STATES.NONE);
        return;
    }

    if (evName === "NODE_IN") {
        if (args.node.getId() !== this.dragCondSrcNode.getId()) {
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_SNAP_TO_NODE", cond : this.dragCond, node : args.node });
        }
        return;
    }

    if (evName === "NODE_OUT") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "COND_UNSNAP_TO_NODE", cond : this.dragCond, node : args.node });
        return;
    }

    this.condCreationCancelHandler(evName, args);
};

//NONE -> STAGE_CHANGE_WAIT -> NONE
SEInputManager.prototype.procStateStageChangeWait = function(evName, args) {
    if (evName === "STAGE_CHANGED") {
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : args.stage.getStageNode(), type : "NODE" });
        return;
    }
};

//NONE -> STAGE_CREATION_WAIT -> STAGE_CHANGE_WAIT -> NONE
SEInputManager.prototype.procStateStageCreationWait = function(evName, args) {
    if (evName === "STAGE_CREATED") {
        this.setState(SEInputManager.STATES.STAGE_CHANGE_WAIT);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "STAGE_CHANGE", fromStage : null, toStage : args.stage });
    }
};

//NONE -> NODE_DELETE_WAIT -> NONE
SEInputManager.prototype.procStateNodeDeleteWait = function(evName, args) {
    if (evName === "NODE_DELETED") {
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : args.stage.getStageNode(), type : "NODE" });
        return;
    }
};

//NONE -> COND_DELETE_WAIT -> NONE
SEInputManager.prototype.procStateCondDeleteWait = function(evName, args) {
    if (evName === "COND_DELETED") {
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : "OBJECT_FOCUS", obj : args.stage.getStageNode(), type : "NODE" });
        return;
    }
};

function SEInputManagerStaticConstructor(completionCB) {
    SEInputManager.STATES = {};
    SEInputManager.STATES.NONE = 0;
    SEInputManager.STATES.WAIT_NODE_POSITIONING = 2;
    SEInputManager.STATES.WAIT_NODE_CREATION = 5;

    SEInputManager.STATES.NODE_DRAG = 3;

    SEInputManager.STATES.EDITOR_ALL_MOVE = 4;

    SEInputManager.STATES.COND_CREATION_WAIT = 6;
    SEInputManager.STATES.COND_DRAGGING = 7;

    SEInputManager.STATES.IGNORE_ALL_EVENTS = 8;

    SEInputManager.STATES.STAGE_CHANGE_WAIT = 9;

    SEInputManager.STATES.STAGE_CREATION_WAIT = 10;

    SEInputManager.STATES.NODE_DELETE_WAIT = 11;
    SEInputManager.STATES.COND_DELETE_WAIT = 12;

    SEInputManager.STATE_PROC = {};
    SEInputManager.STATE_PROC[SEInputManager.STATES.NONE] =
        SEInputManager.prototype.procStateNone;
    SEInputManager.STATE_PROC[SEInputManager.STATES.WAIT_NODE_POSITIONING] =
        SEInputManager.prototype.procStateWaitNodePositioning;
    SEInputManager.STATE_PROC[SEInputManager.STATES.WAIT_NODE_CREATION] =
        SEInputManager.prototype.procStateWaitNodeCreation;

    SEInputManager.STATE_PROC[SEInputManager.STATES.NODE_DRAG] =
        SEInputManager.prototype.procStateNodeDrag;

    SEInputManager.STATE_PROC[SEInputManager.STATES.EDITOR_ALL_MOVE] =
        SEInputManager.prototype.procStateEditorAllMove;

    SEInputManager.STATE_PROC[SEInputManager.STATES.COND_CREATION_WAIT] =
        SEInputManager.prototype.procStateCondCreationWait;
    SEInputManager.STATE_PROC[SEInputManager.STATES.COND_DRAGGING] =
        SEInputManager.prototype.procStateCondDragging;

    SEInputManager.STATE_PROC[SEInputManager.STATES.IGNORE_ALL_EVENTS] =
        SEInputManager.prototype.procStateIgnoreAllEvents;

    SEInputManager.STATE_PROC[SEInputManager.STATES.STAGE_CHANGE_WAIT] =
        SEInputManager.prototype.procStateStageChangeWait;

    SEInputManager.STATE_PROC[SEInputManager.STATES.STAGE_CREATION_WAIT] =
        SEInputManager.prototype.procStateStageCreationWait;

    SEInputManager.STATE_PROC[SEInputManager.STATES.NODE_DELETE_WAIT] =
        SEInputManager.prototype.procStateNodeDeleteWait;

    SEInputManager.STATE_PROC[SEInputManager.STATES.COND_DELETE_WAIT] =
        SEInputManager.prototype.procStateCondDeleteWait;

    SEInputManager.STATE_ENTER = {};

    completionCB();
}

function SEUserInteractionManagerFactory(seEventRouter) {
    return new SEInputManager(seEventRouter);
};
