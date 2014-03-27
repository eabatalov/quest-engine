function ToolBarItem(type, seEvents) {
    this.type = type;

    this.seEvents = seEvents;

	this.dragging = {};
	this.dragging.lastValidPos = new PIXI.Point(0, 0);
	/*this.do.mousedown = this.do.touchstart = toolBarItemMouseDown.bind(this);
	this.do.mouseup = this.do.mouseupoutside = this.do.touchend =
		this.do.touchendoutside = toolBarItemMouseUp.bind(this);
	this.do.mousemove = this.do.touchmove = toolBarItemMouseMove.bind(this);*/
}

function toolBarItemMouseDown(intData) {
	//store a refference to the interaction data
	//The reason for this is because of multitouch
	//we want to track the movement of this particular touch
    if (!this.dragging.pending) {
	    this.setAlpha(0.5);
    	this.dragging.intData = intData;
    	this.dragging.pending = true;
    	this.dragging.srcPos = this.getPos().clone();
    }
}

function toolBarItemMouseMove(intData) {
	if (this.dragging.pending)
	{
		if (!ToolBarItem.positionValidator.validate(this.dragging.intData, this))
			return;
        ToolBarItem.visualTrans.trans(this);

		this.dragging.lastValidPos.x = this.dragging.intData.global.x
		this.dragging.lastValidPos.y = this.dragging.intData.global.y;
		var newPosition = this.getParentBasedPosition(this.dragging.intData);
        this.setPosition(newPosition.x, newPosition.y);
	}
}

function toolBarItemMouseUp(intData) {
	if (this.dragging.pending) {
        var global = intData.global;//XXX
        intData.global = this.dragging.lastValidPos;
        if (ToolBarItem.positionValidator.validate(intData, this)) {
            this.seEvents.broadcast({
                name : "NODE_CREATE",
                type : this.type,
                intData : intData
            });
        }
        intData.global = global;

	    this.setAlpha(1);
        this.setPosition(this.dragging.srcPos.x, this.dragging.srcPos.y);
        ToolBarItem.visualTrans.transBack(this);
	}

	this.dragging.pending = false;
	this.dragging.intData = null;
	this.dragging.srcPos = null;
}

ToolBarItem.prototype.imgUrl = function() {
    return ToolBarItem.IMG_PATHS.icons[this.type];
};

function ToolBarItemStaticConstructor(completionCB) {
    ToolBarItem.IMG_PATHS = { icons : {} };
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.ANIM] = "images/node_anim56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.PHRASE] = "images/node_phrase56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.QUIZ] = "images/node_quiz56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.STAGE] = "images/node_stage56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.STORYLINE] = "images/node_stln56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.WAIT] = "images/node_wait56.png";
    ToolBarItem.IMG_PATHS.icons[_QUEST_NODES.NONE] = "images/node_none56.png";
    completionCB();
}

ToolbarWindowController = function($rootScope, $scope, seEvents) {
    $scope.toolbarRows = [
        [
            new ToolBarItem(_QUEST_NODES.ANIM, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.PHRASE, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.QUIZ, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.STAGE, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.STAGE_CLEAR, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.STORYLINE, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.WAIT, seEvents)
        ],
        [
            new ToolBarItem(_QUEST_NODES.NONE, seEvents)
        ]
    ];

    $scope.initialized = function() {
        seEvents.broadcast({ name : "TOOLBAR_INITED"});
    };

    $scope.onMouseDown = function(toolbarItem) {

    };
    $scope.onMouseMove = function(toolbarItem) {

    };
    $scope.onMouseUp = function(toolbarItem) {

    };
};

function ToolbarStaticConstructor(completionCB) {
    completionCB();
}
