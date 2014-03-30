function SEInputManager(seEvents) {
    this.state = SEInputManager.STATES.NONE;
    this.seEvents = seEvents;
    seEvents.on(this.procEvent.bind(this));

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
    var evName = args.name;
    SEInputManager.STATE_PROC[this.state].call(this, evName, args);
};

SEInputManager.prototype.procStateNone = function(evName, args) {
    if (evName === "TOOLBAR_ITEM_ACTIVATE_CLICK") {
        this.activeTBNodeType = args.type;
        this.setState(SEInputManager.STATES.WAIT_NODE_POSITIONING);
        this.seEvents.broadcast({ name : "TOOLBAR_ITEM_ACTIVATE", item : args.item });
        return;
    };

    if (evName === "NODE_DOWN") {
        this.dragNode = args.node;
        this.setState(SEInputManager.STATES.NODE_DRAG);
        this.seEvents.broadcast({ name : "NODE_DRAG", node : this.dragNode });
    }

    if (evName === "EDITOR_DOWN") {
        this.setState(SEInputManager.STATES.EDITOR_ALL_MOVE);
        this.seEvents.broadcast({ name : "EDITOR_START_DRAG", intData : args.intData });
    }
};

// NONE -> WAIT_NODE_POSITIONING -> NONE
SEInputManager.prototype.nodeCreationCancellHandler = function(evName, args) {
    if (evName === "TOOLBAR_ITEM_DEACTIVATE_CLICK") {
        this.activeTBNodeType = null;
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.broadcast({ name : "TOOLBAR_ITEM_DEACTIVATE", item : args.item });
        return;
    }

    if (evName === "TOOLBAR_ITEM_ACTIVATE_CLICK") {
        this.activeTBNodeType = args.type;
        this.setState(SEInputManager.STATES.WAIT_NODE_POSITIONING);
        this.seEvents.broadcast({ name : "TOOLBAR_ITEM_ACTIVATE", item : args.item });
        return;
    }
};

SEInputManager.prototype.procStateWaitNodePositioning = function(evName, args) {
    if (evName === "EDITOR_CLICK") {
        var type = this.activeTBNodeType;
        this.activeTBNodeType = null;
        this.setState(SEInputManager.STATES.NONE);
        this.seEvents.broadcast({ name : "TOOLBAR_ITEM_DEACTIVATE"});
        this.seEvents.broadcast({ name : "NODE_CREATE", type : type, intData : args.intData });
        return;
    }
    this.nodeCreationCancellHandler(evName, args);
};

//NONE -> NODE_DRAG -> NONE
SEInputManager.prototype.nodeDragCancellHandler = function(evName, args) {
};

SEInputManager.prototype.procStateNodeDrag = function(evName, args) {
    if (evName === "EDITOR_UP") {
        this.seEvents.broadcast({ name : "NODE_END_DRAG", node : this.dragNode });
        this.seEvents.broadcast({ name : "NODE_PROP_EDIT", obj : this.dragNode });
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
        this.seEvents.broadcast({ name : "EDITOR_END_DRAG" });
    }

    this.editorAllMoveCancellHandler(evName, args);
};

function SEInputManagerStaticConstructor(completionCB) {
    SEInputManager.STATES = {};
    SEInputManager.STATES.NONE = 0;
    SEInputManager.STATES.WAIT_NODE_POSITIONING = 2;

    SEInputManager.STATES.NODE_DRAG = 3;

    SEInputManager.STATES.EDITOR_ALL_MOVE = 4;

    SEInputManager.STATE_PROC = {};
    SEInputManager.STATE_PROC[SEInputManager.STATES.NONE] =
        SEInputManager.prototype.procStateNone;
    SEInputManager.STATE_PROC[SEInputManager.STATES.WAIT_NODE_POSITIONING] =
        SEInputManager.prototype.procStateWaitNodePositioning;

    SEInputManager.STATE_PROC[SEInputManager.STATES.NODE_DRAG] =
        SEInputManager.prototype.procStateNodeDrag;

    SEInputManager.STATE_PROC[SEInputManager.STATES.EDITOR_ALL_MOVE] =
        SEInputManager.prototype.procStateEditorAllMove;

    SEInputManager.STATE_ENTER = {};

    completionCB();
}
