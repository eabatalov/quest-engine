function SENode(/* _QUEST_NODES.* */ type, seEvents, isContinue, storyLine, stage, props) {
    SESpriteObject.call(this);
    this.setDO(new PIXI.Sprite(SENode.TEXTURES.nodes[type]));

    this.seEvents = seEvents;
    this.type = type;
    this.storyLine = storyLine;
    this._stage = stage;
    this.continue = (isContinue !== null && isContinue !== undefined) ?
        isContinue : false;
    if (props === null || props === undefined) {
        //Which fields we have for each type of node
        props = {};
        switch(type) {
            case _QUEST_NODES.NONE:
            break;
            case _QUEST_NODES.PHRASE:
                props.storyLine = null;
                props.id = "";
                props.text = "";
                props.phraseType = _UI_PHRASE_TYPES.SPEAK;
            break;
            case _QUEST_NODES.QUIZ:
                props.storyLine = null;
                props.id = "";
                props.text = "";
                props.phraseType = _UI_PHRASE_TYPES.SPEAK;
                props.ans1 = "";
                props.ans2 = "";
                props.ans3 = "";
                props.ans4 = "";
            break;
            case _QUEST_NODES.ANIM:
                props.storyLine = null;
                props.id = "";
                props.name = "";
            break;
            case _QUEST_NODES.WAIT:
                props.secs = "0";
            break;
            case _QUEST_NODES.STAGE_CLEAR:
            break;
            case _QUEST_NODES.STORYLINE:
                props.objs = [];
            break;
            case _QUEST_NODES.STAGE:
                props.name = "";
            break;
        }
    }
    switch(type) {
        case _QUEST_NODES.STORYLINE:
            this.methods = {};
            this.methods.addObject = storyLineAddObject.bind(this);
        break;
        case _QUEST_NODES.STAGE:
            this.methods = {};
            this.methods.addObject = stageAddObject.bind(this);
            this.methods.takeFromPool = stageTakeFromPool.bind(this);
        break;
    }
    this.props =  props;
    this.conds = [];
    this.do.click = nodeClicked.bind(this);
}

SENode.prototype = new SESpriteObject();
SENode.prototype.constructor = SENode;

function nodeClicked(intData) {
    if (intData.originalEvent.shiftKey) {
        SENode.treeEditor.deleteNode(this);
    } else {
        this.seEvents.broadcast({
            name : "NODE_PROP_EDIT",
            obj : this
        });
    }
}

function storyLineAddObject(objId) {
    this.props.objs.push(objId);
    this._stage.methods.takeFromPool(objId);
}

function stageAddObject(objId) {
    this.props.objs.push(objId);
    this.props.objPool.push(objId);
}

function stageTakeFromPool(objId) {
    this.props.objPool.remove(objId);
}

function SENodeStaticConstructor(completionCB) {
    SENode.TEXTURE_PATHS = { nodes : {} };
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM] = "images/node_anim56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE] = "images/node_phrase56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ] = "images/node_quiz56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE] = "images/node_stage56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE] = "images/node_stln56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT] = "images/node_wait56.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE] = "images/node_none56.png";

    var assetsToLoad = $.map(SENode.TEXTURE_PATHS.nodes,
        function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        SENode.TEXTURES = { nodes : {} };
        SENode.TEXTURES.nodes[_QUEST_NODES.ANIM] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM]);
        SENode.TEXTURES.nodes[_QUEST_NODES.PHRASE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.QUIZ] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STAGE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STAGE_CLEAR] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STORYLINE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.WAIT] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT]);
        SENode.TEXTURES.nodes[_QUEST_NODES.NONE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE]);

        completionCB();
    };
    loader.load();
}
