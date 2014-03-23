function ToolBarItem(type, seEvents, sceneUpdater) {
    SESpriteObject.call(this);
    this.setDO(new PIXI.Sprite(ToolBarItem.TEXTURES.icons[type]));

    this.type = type;
    this.do.buttonMode = true;

    this.seEvents = seEvents;
	this.sceneUpdater = sceneUpdater;

	this.dragging = {};
	this.dragging.wh = new PIXI.Point(this.getWidth(), this.getHeight());
	this.dragging.lastValidPos = new PIXI.Point(0, 0);
	this.mousedown = this.touchstart = toolBarItemMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend =
		this.touchendoutside = toolBarItemMouseUp;
	this.mousemove = this.touchmove = toolBarItemMouseMove;
}

ToolBarItem.prototype = new SESpriteObject();

function toolBarItemMouseDown(intData) {
	//store a refference to the interaction data
	//The reason for this is because of multitouch
	//we want to track the movement of this particular touch
    if (!this.dragging.pending) {
	    this.setAlpha(0.5);
    	this.dragging.intData = intData;
    	this.dragging.pending = true;
    	this.dragging.srcPos = this.getPos.clone();
    }
}

function toolBarItemMouseMove(intData) {
	if (this.dragging.pending)
	{
		if (!ToolBarItem.positionValidator.validate(this.dragging.intData, this.dragging.wh))
			return;

		this.dragging.lastValidPos.x = this.dragging.intData.global.x
		this.dragging.lastValidPos.y = this.dragging.intData.global.y;
		var newPosition = this.parent.sedo.getLocalPosition(this.dragging.intData);
        this.setPosition(newPosition.x, newPosition.y);
		this.sceneUpdater.up();
	}
}

function toolBarItemMouseUp(intData) {
	if (this.dragging.pending) {
		this.setPosition(this.dragging.srcPos.x, this.dragging.srcPos.y);

		//XXX
		var global = intData.global;
		intData.global = this.dragging.lastValidPos;
		this.seEvents.broadcast({
			name : "NODE_CREATE",
			type : this.type,
			intData : intData
		});
		intData.global = global;
	}

	this.setAlpha(1);
	this.dragging.pending = false;
	this.dragging.intData = null;
	this.dragging.srcPos = null;
	this.sceneUpdater.up();
}

function ToolBarItemStaticConstructor(completionCB) {
    ToolBarItem.TEXTURE_PATHS = { icons : {} };
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.ANIM] = "images/node_anim56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.PHRASE] = "images/node_phrase56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.QUIZ] = "images/node_quiz56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE] = "images/node_stage56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STORYLINE] = "images/node_stln56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.WAIT] = "images/node_wait56.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.NONE] = "images/node_none56.png";

    var assetsToLoad = $.map(ToolBarItem.TEXTURE_PATHS.icons,
        function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ToolBarItem.TEXTURES = { icons : {} };
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.ANIM] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.ANIM]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.PHRASE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.PHRASE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.QUIZ] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.QUIZ]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.STAGE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.STAGE_CLEAR] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE_CLEAR]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.STORYLINE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STORYLINE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.WAIT] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.WAIT]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODES.NONE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.NONE]);

        completionCB();
    };
    loader.load();
}

function Toolbar(parentPanel, seEvents, sceneUpdater) {
    SEDisplayObject.call(this);
    this.setDO(new PIXI.DisplayObjectContainer());

    this.setWH(parentPanel.width, parentPanel.height);
    this.setParent(parentPanel);

    this.seEvents = seEvents;
	this.sceneUpdater = sceneUpdater;

    var TOOL_ITEM_MARGIN = 8;
    this.icons = {};
    this.icons.anim = new ToolBarItem(_QUEST_NODES.ANIM, this.seEvents, this.sceneUpdater);
    this.icons.phrase = new ToolBarItem(_QUEST_NODES.PHRASE, this.seEvents, this.sceneUpdater);
    this.icons.quiz = new ToolBarItem(_QUEST_NODES.QUIZ, this.seEvents, this.sceneUpdater);
    this.icons.stage = new ToolBarItem(_QUEST_NODES.STAGE, this.seEvents, this.sceneUpdater);
    this.icons.stageClear = new ToolBarItem(_QUEST_NODES.STAGE_CLEAR, this.seEvents, this.sceneUpdater);
    this.icons.storyLine = new ToolBarItem(_QUEST_NODES.STORYLINE, this.seEvents, this.sceneUpdater);
    this.icons.wait = new ToolBarItem(_QUEST_NODES.WAIT, this.seEvents, this.sceneUpdater);
    this.icons.none = new ToolBarItem(_QUEST_NODES.NONE, this.seEvents, this.sceneUpdater);

    //Make toolbar items layout
    var ix = 0;
    var maxPerColumn = this.height / (this.icons.none.height + TOOL_ITEM_MARGIN);
    $.each(this.icons, function(key, icon) {
        icon.setPosition(
            Math.floor(ix / maxPerColumn) * (TOOL_ITEM_MARGIN + icon.width),
            (ix % maxPerColumn) * (TOOL_ITEM_MARGIN + icon.height)
        );
        icon.setParent(this);
        ++ix;
    }.bind(this));
}

Toolbar.prototype = new SEDisplayObject();

function ToolbarStaticConstructor(completionCB) {
    completionCB();
}
