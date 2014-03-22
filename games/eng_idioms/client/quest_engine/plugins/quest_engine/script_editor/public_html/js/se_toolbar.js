function ToolBarItem(type, seEvents, sceneUpdater) {
    PIXI.Sprite.call(this, ToolBarItem.TEXTURES.icons[type]);
	this.width = 56;
    this.height = 56;
    this.type = type;
    this.setInteractive(true);
    this.buttonMode = true;

    this.seEvents = seEvents;
	this.sceneUpdater = sceneUpdater;

	this.dragging = {};
	this.mousedown = this.touchstart = toolBarItemMouseDown;
	this.mouseup = this.mouseupoutside = this.touchend =
		this.touchendoutside = toolBarItemMouseUp;
	this.mousemove = this.touchmove = toolBarItemMouseMove;
}

function toolBarItemMouseDown(intData) {
	//store a refference to the interaction data
	//The reason for this is because of multitouch
	//we want to track the movement of this particular touch
	this.alpha = 0.5;
	this.dragging.intData = intData;
	this.dragging.pending = true;
	this.dragging.srcPos = this.position.clone();
}

function toolBarItemMouseMove(intData) {
	if (this.dragging.pending)
	{
		var newPosition = this.dragging.intData.getLocalPosition(this.parent);
		this.position.x = newPosition.x;
		this.position.y = newPosition.y;
		this.sceneUpdater.up();
	}
}

function toolBarItemMouseUp(intData) {
	if (this.dragging.pending) {
		this.position = this.dragging.srcPos;

		this.seEvents.broadcast({
			name : "NODE_CREATE",
			type : this.type,
			intData : intData
		});
	}

	this.alpha = 1;
	this.dragging.pending = false;
	this.dragging.intData = null;
	this.srcPos = null;
	this.sceneUpdater.up();
}

function ToolBarItemStaticConstructor(completionCB) {
    ToolBarItem.TEXTURE_PATHS = { icons : {} };
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.ANIM] = "images/node_anim.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.PHRASE] = "images/node_phrase.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.QUIZ] = "images/node_quiz.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE] = "images/node_stage.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.STORYLINE] = "images/node_stln.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.WAIT] = "images/node_wait.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODES.NONE] = "images/node_none.png";

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

        ToolBarItem.prototype = new PIXI.Sprite(ToolBarItem.TEXTURES.icons[_QUEST_NODES.NONE]);
        ToolBarItem.prototype.constructor = ToolBarItem;
        completionCB();
    };
    loader.load();
}

function Toolbar(parentPanel, seEvents, sceneUpdater) {
    this.height = parentPanel.height;
    this.width = parentPanel.width;
    parentPanel.addChild(this);

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
        icon.position.x = Math.floor(ix / maxPerColumn) * (TOOL_ITEM_MARGIN + icon.width);
        icon.position.y = (ix % maxPerColumn) * (TOOL_ITEM_MARGIN + icon.height);
        this.addChild(icon);
        ++ix;
    }.bind(this));
}

function ToolbarStaticConstructor(completionCB) {
    Toolbar.prototype = new PIXI.DisplayObjectContainer();
    Toolbar.prototype.constructor = Toolbar;
    completionCB();
}
