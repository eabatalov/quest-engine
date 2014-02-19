function ToolBarItem(type) {
    PIXI.Sprite.call(this, ToolBarItem.TEXTURES.icons[type]);
    this.type = type;
    this.setInteractive(true);
    this.buttonMode = true;
    //All this events should be handled in order to
    //mouseupoutside be fired
    this.mousedown = toolBarItemMouseDown;
    this.mouseup = toolBarItemMouseUp;
    this.mouseupoutside = toolBarItemMouseUpOutside;
}

function toolBarItemMouseUp() {}
function toolBarItemMouseDown() {}

function toolBarItemMouseUpOutside(interactionData) {;
    var uiEvents = angular.element($("#scriptEditorCanvas").get(0)).injector().
        get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "NODE_CREATE",
        type : interactionData.target.type,
        targetPointGlobal : interactionData.global
    });
}

function ToolBarItemStaticConstructor(completionCB) {
    ToolBarItem.TEXTURE_PATHS = { icons : {} };
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_ANIM] = "images/node_anim.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_PHRASE] = "images/node_phrase.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_QUIZ] = "images/node_quiz.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STAGE] = "images/node_stage.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STAGE_CLEAR] = "images/node_stcl.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STORYLINE] = "images/node_stln.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_WAIT] = "images/node_wait.png";
    ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_NONE] = "images/node_none.png";

    var assetsToLoad = $.map(ToolBarItem.TEXTURE_PATHS.icons,
        function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ToolBarItem.TEXTURES = { icons : {} };
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_ANIM] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_ANIM]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_PHRASE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_PHRASE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_QUIZ] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_QUIZ]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_STAGE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STAGE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_STAGE_CLEAR] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STAGE_CLEAR]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_STORYLINE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_STORYLINE]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_WAIT] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_WAIT]);
        ToolBarItem.TEXTURES.icons[_QUEST_NODE_NONE] =
            PIXI.Texture.fromImage(ToolBarItem.TEXTURE_PATHS.icons[_QUEST_NODE_NONE]);

        ToolBarItem.prototype = new PIXI.Sprite(ToolBarItem.TEXTURES.icons[_QUEST_NODE_NONE]);
        ToolBarItem.prototype.constructor = ToolBarItem;
        completionCB();
    };
    loader.load();
}
$(document).ready(ToolBarItemStaticConstructor);

function Toolbar(parentPanel) {
    this.height = parentPanel.height;
    this.width = parentPanel.width;
    parentPanel.addChild(this);

    var TOOL_ITEM_MARGIN = 8;
    this.icons = {};
    this.icons.anim = new ToolBarItem(_QUEST_NODE_ANIM);
    this.icons.phrase = new ToolBarItem(_QUEST_NODE_PHRASE);
    this.icons.quiz = new ToolBarItem(_QUEST_NODE_QUIZ);
    this.icons.stage = new ToolBarItem(_QUEST_NODE_STAGE);
    this.icons.stageClear = new ToolBarItem(_QUEST_NODE_STAGE_CLEAR);
    this.icons.storyLine = new ToolBarItem(_QUEST_NODE_STORYLINE);
    this.icons.wait = new ToolBarItem(_QUEST_NODE_WAIT);
    this.icons.none = new ToolBarItem(_QUEST_NODE_NONE);

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