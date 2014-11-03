var _QR_ACTION_TYPES = {
    NONE : -1,
    PHRASE : 1,
    QUIZ : 3,
    ANIM : 4,
    WAIT : 5,
    STAGE_CLEAR : 6,
    FUNC_CALL : 7,
    NOTIFICATION : 8,
    PLAYER_MOVEMENT : 9,
    CMD_SEQUENCE_STARTED : 10,
    CMD_SEQUENCE_FINISHED : 11
};

var _QR_ACTION_CONTINUATION_TYPES = {
    NONE : "NONE",
    CONTINUE : "CONTINUE",
};

function QRAction(type) {
    //Almost script node dependant field
    this.stageName = null;
    this.type = type || _QR_ACTION_TYPES.NONE;
    this.hasNext = false;
    this.canReverse = false;
    this.continuation = _QR_ACTION_CONTINUATION_TYPES.NONE;
    this.id = null;
    this.text = null;
    this.phraseType = null;
    this.phraseSize = null;
    this.ans1 = null;
    this.ans2 = null;
    this.ans3 = null;
    this.ans4 = null;
    this.secs = null;
    this.source = null;
    this.params = null;
    this.enabled = null;
    //Quest cond dependant fileds
    this.clearStage = true;
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
            this.phraseSize = node.getProp('phraseSize');
            this.text = node.getProp('text');
        break;
        case _QUEST_NODES.QUIZ:
            this.type = _QR_ACTION_TYPES.QUIZ;
            this.id = node.getProp('id');
            this.phraseType = node.getProp('phraseType');
            this.phraseSize = node.getProp('phraseSize');
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
            this.secs = node.getProp('secs');
        break;
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

QRAction.prototype.initFromCond = function(cond) {
    /*
     * Calling of this func is optional for now
     * because clearStage value needs to be preserved
     * only in forward interpretation case.
     */
    this.cond = cond;
    switch(cond.getType())
    {
        case _QUEST_CONDS.NEXT:
            this.setClearStage(cond.getProp('clearStage'));
        break;
    };
};

QRAction.genCmdSeqStart = function(action) {
    var qrActionStartSeq =
        new QRAction(_QR_ACTION_TYPES.CMD_SEQUENCE_STARTED);
    qrActionStartSeq.setStageName(action.getStageName());
    qrActionStartSeq.setClearStage(action.getClearStage());
    return qrActionStartSeq;
};

/*
 * Seq finished action should be partially cloned
 * from the last action @action in seq
 * to preserve qualities of @action
 */
QRAction.genCmdSeqFinish = function(action) {
    var seqFinishAction =
        new QRAction(_QR_ACTION_TYPES.CMD_SEQUENCE_FINISHED);
    seqFinishAction.setStageName(action.getStageName());
    seqFinishAction.setContinuation(action.getContinuation());
    seqFinishAction.setCanReverse(action.getCanReverse());
    seqFinishAction.setHasNext(action.getHasNext());
    return seqFinishAction;
};

QRAction.prototype.getStageName = function() {
    return this.stageName;
};

QRAction.prototype.setStageName = function(stageName) {
    this.stageName = stageName;
};

QRAction.prototype.getType = function() {
    return this.type;
};

QRAction.prototype.setType = function(type) {
    this.type = type;
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

QRAction.prototype.setCanReverse = function(value) {
    this.canReverse = value;
};

QRAction.prototype.getCanReverse = function() {
    return this.canReverse;
};

QRAction.prototype.getContinuation = function() {
    return this.continuation;
};

QRAction.prototype.setContinuation = function(val) {
    this.continuation = val;
};

QRAction.prototype.setClearStage = function(val) {
    this.clearStage = val;
};

QRAction.prototype.getClearStage = function() {
    return this.clearStage;
};
