/*
 * Responsible for consistent state of quest objects collections
 * in the whole script.
 * Now it simply puts all the storyline objects back to its stage pool
 * when the storyline is deleted.
 */
function QuestObjectsManager(script, stageSearch) {
    this.script = script;
    this.stageSearch = stageSearch;
    this.scriptEvHandlers = [
        this.script.events.stageAdded.subscribe(this, this.stageAdded),
        this.script.events.stageDeleted.subscribe(this, this.stageDeleted)
    ];
    this.stageQuestObjectManagers = new ObjectMap();
    jQuery.each(script.getStages(), function(ix, stage) {
        this.stageAdded(stage);
    }.bind(this));
}

QuestObjectsManager.prototype.delete = function() {
    delete this.script;
    delete this.stageSearch;
    jQuery.each(this.scriptEvHandlers, collectionObjectDelete);
    delete this.scriptEvHandlers;
    this.stageQuestObjectManagers.each(collectionObjectDelete);
    delete this.stageQuestObjectManagers;
};

QuestObjectsManager.prototype.stageAdded = function(stage) {
    this.stageQuestObjectManagers.put(stage,
        new StageQuestObjectManager(stage, this.stageSearch));
};

QuestObjectsManager.prototype.stageDeleted = function(stage) {
    var stageQuestObjectManager =
        this.stageQuestObjectManagers.remove(stage);
    stageQuestObjectManager.delete();
};

function StageQuestObjectManager(stage, stageSearch) {
    this.stage = stage;
    this.stageSearch = stageSearch;
    this.stageEvHandlers = [
        this.stage.events.nodeDeleted.subscribe(this, this.nodeDeleted)
    ];
};

StageQuestObjectManager.prototype.delete = function() {
    delete this.stage;
    delete this.stageSearch;
    jQuery.each(this.stageEvHandlers, collectionObjectDelete);
    delete this.stageEvHandlers;
};

StageQuestObjectManager.prototype.nodeDeleted = function(node) {
    if (node.getType() !== _QUEST_NODES.STORYLINE)
        return;

    var stage = this.stageSearch.search(node);
    if (stage === null)
        return;

    jQuery.each(node.props.objs, function(ix, obj) {
        node.removeObject(obj, stage);
    }.bind(this));
};
