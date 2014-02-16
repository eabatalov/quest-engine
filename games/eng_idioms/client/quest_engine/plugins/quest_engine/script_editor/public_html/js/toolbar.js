function ToolBarItem(type) {
    PIXI.Sprite.call(this, TEXTURES.nodes[type]);
    this.priv = {};
    this.priv.type = type;
    this.setInteractive(true);
    this.buttonMode = true;
    this.mousedown = toolIconMouseDown;
    this.mouseup = toolIconMouseUp;
    this.mouseupoutside = toolIconMouseUpOutside;
}


function toolIconMouseDown() {
    /*var uiEvents = angular.element($("#toolbarAndTreeCanvas").get(0)).injector().
        get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "TOOL_ICON_DRAGGING",
        obj : interactionData.target
    });*/
}

function toolIconMouseUp() {
    //alert("toolIconMouseUp");
}

function toolIconMouseUpOutside(interactionData) {
    var uiEvents = angular.element($("#toolbarAndTreeCanvas").get(0)).injector().
        get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "NODE_CREATE",
        type : interactionData.target.priv.type,
        targetPointGlobal : interactionData.global
    })
}

function Toolbar() {
    ToolBarItem.prototype = new PIXI.Sprite(TEXTURES.bg);
    ToolBarItem.prototype.constructor = SECond;

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

    var ix = 0;
    var maxPerColumn = 4;
    $.each(this.icons, function(key, icon) {
        icon.position.x = Math.floor(ix / maxPerColumn) * (TOOL_ITEM_MARGIN + icon.width);
        icon.position.y = (ix % maxPerColumn) * (TOOL_ITEM_MARGIN + icon.height);
        this.addChild(icon);
        ++ix;
    }.bind(this));
}