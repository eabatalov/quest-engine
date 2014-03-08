function SENode(/* _QUEST_NODES.* */ type, seEvents, isContinue, storyLine, stage, props) {
    PIXI.Sprite.call(this, SENode.TEXTURES.nodes[type]);
    //Workaround to make node icons smaller
    //because they are too big now
    this.width = 56;
    this.height = 56;
    this.hitArea = this.getBounds();

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
    this.setInteractive(true);
    this.click = nodeClicked.bind(this);
}

function nodeClicked(intData) {
    if (intData.originalEvent.shiftKey) {
        /*Looks like a PIXI bug
        Interation manager throws exception after
        interactive object was deleted*/
        this.setInteractive(false);
        SENode.treeEditor.deleteNode(this);
    } else {
        this.seEvents.broadcast({
            name : "NODE_PROP_EDIT",
            obj : intData.target
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
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM] = "images/node_anim.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE] = "images/node_phrase.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ] = "images/node_quiz.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE] = "images/node_stage.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE] = "images/node_stln.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT] = "images/node_wait.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE] = "images/node_none.png";

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

        SENode.prototype = new PIXI.Sprite(SENode.TEXTURES.nodes[_QUEST_NODES.NONE]);
        SENode.prototype.constructor = SENode;
        completionCB();
    };
    loader.load();
}
