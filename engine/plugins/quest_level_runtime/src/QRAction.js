var _QR_ACTION_TYPES = {
    NONE : -1,
    PHRASE : 1,
    QUIZ : 3,
    ANIM : 4,
    WAIT : 5,
    STAGE_CLEAR : 6,
    FUNC_CALL : 7,
    NOTIFICATION : 8,
    PLAYER_MOVEMENT : 9
};

function QRAction(type) {
    this.type = type || _QR_ACTION_TYPES.NONE;
    this.hasNext = false;
    this.canRollback = false;
    this.continue = false;
    this.isRollback = false;
    this.id = null;
    this.text = null;
    this.phraseType = null;
    this.ans1 = null;
    this.ans2 = null;
    this.ans3 = null;
    this.ans4 = null;
    this.secs = null;
    this.rollbackName = null;
    this.source = null;
    this.params = null;
    this.enabled = null;
}

QRAction.prototype.initFromNode = function(node) {
    this.node = node;
    switch(node.getType()) {
        case _QUEST_NODES.NONE:
		case _QUEST_NODES.STORYLINE:
            this.type = _QR_ACTION_TYPES.NONE;
        break;
        case _QUEST_NODES.PHRASE:
            this.type = _QR_ACTION_TYPES.PHRASE;
            this.id = node.getProp('id');
            this.phraseType = node.getProp('phraseType');
            this.text = node.getProp('text');
        break;
        case _QUEST_NODES.QUIZ:
            this.type = _QR_ACTION_TYPES.QUIZ;
            this.id = node.getProp('id');
            this.phraseType = node.getProp('phraseType');
            this.text = node.getProp('text');
            this.ans1 = node.getProp('ans1');
            this.ans2 = node.getProp('ans2');
            this.ans3 = node.getProp('ans3');
            this.ans4 = node.getProp('ans4');
        break;
        case _QUEST_NODES.ANIM:
            this.type = _QR_ACTION_TYPES.ANIM;
            this.id = node.getProp('id');
            this.name = node.getProp('name');
        case _QUEST_NODES.WAIT:
            this.type = _QR_ACTION_TYPES.WAIT;
            this.secs = node.getProp('secs');
        break;
        case _QUEST_NODES.STAGE_CLEAR:
            this.type = _QR_ACTION_TYPES.STAGE_CLEAR;
        break;
        case _QUEST_NODES.FUNC_CALL:
            this.type = _QR_ACTION_TYPES.FUNC_CALL;
            this.name = node.getProp('name');
            this.rollbackName = node.getProp('rollbackName');
            this.source = node.getProp('source');
            this.params = node.getProp('params');
        break;
        case _QUEST_NODES.NOTIFICATION:
            this.type = _QR_ACTION_TYPES.NOTIFICATION;
            this.text = node.getProp('text');
        break;
        case _QUEST_NODES.PLAYER_MOVEMENT:
            this.type = _QR_ACTION_TYPES.PLAYER_MOVEMENT;
            this.enabled = node.getProp('enabled');
        break;
        default:
            assert(false, 'Node has invalid type');
    };
};

QRAction.prototype.getType = function() {
    return this.type;
};

QRAction.prototype.getNode = function() {
    return this.node;
};

QRAction.prototype.setHasNext = function(hasNext) {
    this.hasNext = hasNext;
};

QRAction.prototype.getHasNext = function() {
    return this.hasNext;
};

QRAction.prototype.setCanRollback = function(value) {
    this.canRollback = value;
};

QRAction.prototype.getCanRollback = function() {
    return this.canRollback;
};

QRAction.prototype.getContinue = function() {
    return this.continue;
};

QRAction.prototype.setContinue = function(isContinue) {
    this.continue = isContinue;
};

QRAction.prototype.setIsRollback = function(isRollback) {
    this.isRollback = isRollback;
};

QRAction.prototype.getIsRollback = function() {
    return this.isRollback;
};
