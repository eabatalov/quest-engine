function ToolBarItem(type, seEvents) {
    PIXI.Sprite.call(this, ToolBarItem.TEXTURES.icons[type]);
    this.type = type;
    this.setInteractive(true);
    this.buttonMode = true;

    this.seEvents = seEvents;
    //All this events should be handled in order to
    //mouseupoutside be fired
    this.mousedown = toolBarItemMouseDown.bind(this);
    this.mouseup = toolBarItemMouseUp.bind(this);
    this.mouseupoutside = toolBarItemMouseUpOutside.bind(this);
}

function toolBarItemMouseUp() {}
function toolBarItemMouseDown() {}

function toolBarItemMouseUpOutside(interactionData) {
    this.seEvents.broadcast({
        name : "NODE_CREATE",
        type : interactionData.target.type,
        targetPointGlobal : interactionData.global
    });
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
$(document).ready(ToolBarItemStaticConstructor);

function Toolbar(parentPanel, seEvents) {
    this.height = parentPanel.height;
    this.width = parentPanel.width;
    parentPanel.addChild(this);

    this.seEvents = seEvents;

    var TOOL_ITEM_MARGIN = 8;
    this.icons = {};
    this.icons.anim = new ToolBarItem(_QUEST_NODES.ANIM, this.seEvents);
    this.icons.phrase = new ToolBarItem(_QUEST_NODES.PHRASE, this.seEvents);
    this.icons.quiz = new ToolBarItem(_QUEST_NODES.QUIZ, this.seEvents);
    this.icons.stage = new ToolBarItem(_QUEST_NODES.STAGE, this.seEvents);
    this.icons.stageClear = new ToolBarItem(_QUEST_NODES.STAGE_CLEAR, this.seEvents);
    this.icons.storyLine = new ToolBarItem(_QUEST_NODES.STORYLINE, this.seEvents);
    this.icons.wait = new ToolBarItem(_QUEST_NODES.WAIT, this.seEvents);
    this.icons.none = new ToolBarItem(_QUEST_NODES.NONE, this.seEvents);

    //Make toolbar items layout
    var ix = 0;
    var maxPerColumn = 4;
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

function ToolbarFactory(toolbarParentSprite, seEvents) {
    return new Toolbar(toolbarParentSprite, seEvents);
};
