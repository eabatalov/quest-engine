function SENode(/* _QUEST_NODE_* */ type, isContinue, props) {
    PIXI.Sprite.call(this, SENode.TEXTURES.nodes[type]);
    //Workaround to make node icons smaller
    //because they are too big now
    this.width = 56;
    this.height = 56;

    this.type = type;
    this.continue = (isContinue !== null && isContinue !== undefined) ?
        isContinue : false;
    if (props === null || props === undefined) {
        props = {};
        switch(type) {
            case _QUEST_NODE_NONE:
            break;
            case _QUEST_NODE_PHRASE:
                props.id = "TYPE SPEAKER OBJECT ID";
                props.text = "PHRASE TEXT";
            break;
            case _QUEST_NODE_QUIZ:
                props.id = "TYPE SPEAKER OBJECT ID";
                props.text = "QUIZ TEXT";
                props.ans1 = "ANSWER OPTION 1";
                props.ans2 = "ANSWER OPTION 2";
                props.ans3 = "ANSWER OPTION 3";
                props.ans4 = "ANSWER OPTION 4";
            break;
            case _QUEST_NODE_ANIM:
                props.id = "TYPE OBJECT ID";
                props.name = "ANIMATION NAME";
            break;
            case _QUEST_NODE_WAIT:
                props.secs = "SECONDS TO WAIT FOR";
            break;
            case _QUEST_NODE_STAGE_CLEAR:
            break;
            case _QUEST_NODE_STORYLINE:
                props.objs = [];
            break;
            case _QUEST_NODE_STAGE:
                props.name = "TYPE STAGE NAME";
            break;
        }
    }
    this.props =  props;
    this.conds = [];
    this.setInteractive(true);
    this.click = nodeClicked;
}

function nodeClicked(intData) {
    var uiEvents = angular.element($("#scriptEditorCanvas").get(0)).injector().
            get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "NODE_PROP_EDIT",
        obj : intData.target
    });
}

function SENodeStaticConstructor(completionCB) {
    SENode.TEXTURE_PATHS = { nodes : {} };
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_ANIM] = "images/node_anim.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_PHRASE] = "images/node_phrase.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_QUIZ] = "images/node_quiz.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STAGE] = "images/node_stage.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STAGE_CLEAR] = "images/node_stcl.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STORYLINE] = "images/node_stln.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_WAIT] = "images/node_wait.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_NONE] = "images/node_none.png";

    var assetsToLoad = $.map(SENode.TEXTURE_PATHS.nodes,
        function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        SENode.TEXTURES = { nodes : {} };
        SENode.TEXTURES.nodes[_QUEST_NODE_ANIM] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_ANIM]);
        SENode.TEXTURES.nodes[_QUEST_NODE_PHRASE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_PHRASE]);
        SENode.TEXTURES.nodes[_QUEST_NODE_QUIZ] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_QUIZ]);
        SENode.TEXTURES.nodes[_QUEST_NODE_STAGE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STAGE]);
        SENode.TEXTURES.nodes[_QUEST_NODE_STAGE_CLEAR] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STAGE_CLEAR]);
        SENode.TEXTURES.nodes[_QUEST_NODE_STORYLINE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_STORYLINE]);
        SENode.TEXTURES.nodes[_QUEST_NODE_WAIT] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_WAIT]);
        SENode.TEXTURES.nodes[_QUEST_NODE_NONE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODE_NONE]);

        SENode.prototype = new PIXI.Sprite(SENode.TEXTURES.nodes[_QUEST_NODE_NONE]);
        SENode.prototype.constructor = SENode;
        completionCB();
    };
    loader.load();
}