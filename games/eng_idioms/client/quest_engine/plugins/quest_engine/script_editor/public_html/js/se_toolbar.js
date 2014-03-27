function ToolBarItem(type, seEvents, label) {

    this.type = type;
    this.seEvents = seEvents;

	this.dragging = {};
	this.dragging.lastValidPos = new PIXI.Point(0, 0);
	/*this.do.mousedown = this.do.touchstart = toolBarItemMouseDown.bind(this);
	this.do.mouseup = this.do.mouseupoutside = this.do.touchend =
		this.do.touchendoutside = toolBarItemMouseUp.bind(this);
	this.do.mousemove = this.do.touchmove = toolBarItemMouseMove.bind(this);*/
    this.isActive = false;
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
    return ToolBarItem.DATA[this.type].iconUrl;
};

ToolBarItem.prototype.label = function() {
    return ToolBarItem.DATA[this.type].label;
}

ToolBarItem.prototype.equals = function(itemB) {
    return this.type === itemB.type;
};

function ToolBarItemStaticConstructor(completionCB) {
    function ItemConfig(iconUrl, label) { this.iconUrl = iconUrl; this.label = label; }
    ToolBarItem.DATA = {};
    ToolBarItem.DATA[_QUEST_NODES.ANIM] =
        new ItemConfig("images/node_anim56.png", "Animation");
    ToolBarItem.DATA[_QUEST_NODES.PHRASE] = new ItemConfig("images/node_phrase56.png", "Phrase");
    ToolBarItem.DATA[_QUEST_NODES.QUIZ] = new ItemConfig("images/node_quiz56.png", "Quiz");
    ToolBarItem.DATA[_QUEST_NODES.STAGE] = new ItemConfig("images/node_stage56.png", "Stage");
    ToolBarItem.DATA[_QUEST_NODES.STAGE_CLEAR] = new ItemConfig("images/node_stcl56.png", "Clear");
    ToolBarItem.DATA[_QUEST_NODES.STORYLINE] = new ItemConfig("images/node_stln56.png", "Storyline");
    ToolBarItem.DATA[_QUEST_NODES.WAIT] = new ItemConfig("images/node_wait56.png", "Delay");
    ToolBarItem.DATA[_QUEST_NODES.NONE] = new ItemConfig("images/node_none56.png", "Nothing");

    completionCB();
}

ToolbarWindowController = function($rootScope, $scope, seEvents) {
    $scope.toolbarItems = [
            new ToolBarItem(_QUEST_NODES.ANIM, seEvents),
            new ToolBarItem(_QUEST_NODES.PHRASE, seEvents),
            new ToolBarItem(_QUEST_NODES.QUIZ, seEvents),
            new ToolBarItem(_QUEST_NODES.STAGE, seEvents),
            new ToolBarItem(_QUEST_NODES.STAGE_CLEAR, seEvents),
            new ToolBarItem(_QUEST_NODES.STORYLINE, seEvents),
            new ToolBarItem(_QUEST_NODES.WAIT, seEvents),
            new ToolBarItem(_QUEST_NODES.NONE, seEvents)
    ];

    $scope.initialized = function() {
        $rootScope.$emit("TOOLBAR_INITED");
    };

    $scope.activateItem = function(toolbarItem) {
        if (!toolbarItem.isActive) {
            toolbarItem.isActive = true;
        }
    };

    $scope.deactivateItem = function(toolbarItem) {
        if (toolbarItem.isActive) {
            toolbarItem.isActive = false;
        }
    };

    $scope.itemClicked = function(toolbarItem) {
        $.each($scope.toolbarItems, function(ix, item) {
            if (toolbarItem.equals(item)) {
                if (toolbarItem.isActive)
                    $scope.deactivateItem(toolbarItem);
                else $scope.activateItem(toolbarItem);
            } else {
                $scope.deactivateItem(item);
            }
        });
    };
};

function ToolbarStaticConstructor(completionCB) {
    completionCB();
}
