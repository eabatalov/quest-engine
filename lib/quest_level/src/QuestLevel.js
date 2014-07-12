/*
 * @callback is called when level is ready
 */
function QuestLevel(levelName, script, status) {
    this.name = levelName;
    this.script = script;
    this.status = status || QuestLevel.STATUS.UNDEFINED;
}

QuestLevel.STATUS = {
    UNDEFINED : -1,
    UNAVALIABLE : 0,
    LOCKED : 1,
    UNLOCKED : 2,
    LAST : 3
};

QuestLevel.prototype.getStatus = function() {
    return this.status;
};

QuestLevel.prototype.setStatus = function(status) {
    this.status = status;
};

QuestLevel.prototype.getScript = function() {
    return this.script;
};

QuestLevel.prototype.getName = function() {
    return this.name;
};

/*
 * returns plain js object with saved data
 */
QuestLevel.magic = "Eb0uoL";
QuestLevel.prototype.save = function() {
    var savedData = JSON.stringify({
        ver : 1,
        magic : QuestLevel.magic,
        status : this.status,
        name : this.name
    });
    return savedData;
};

/*
 * returns: restored instance of QuestLevel
 */
QuestLevel.load = function(savedData, questScriptLoader) {
    assert(savedData.ver === 1);
    assert(savedData.magic === QuestLevel.magic);

    var result = new QuestLevel(
        SEScript.load(savedData.script),
        savedData.status,
        questScriptLoader
    );
    return result;
};
