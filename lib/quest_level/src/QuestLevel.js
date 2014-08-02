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
    //Level is not usable at all now
    UNAVALIABLE : 0,
    //Level can be unlocked as a results of player progress
    LOCKED : 1,
    IN_PROGRESS : 2,
    COMPLETED : 3,
    LAST : 4
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
    var savedData = {
        ver : 1,
        magic : QuestLevel.magic,
        status : this.status,
        name : this.name
    };
    return savedData;
};

/*
 * returns: new instance of QuestLevel restored from savedData
 */
QuestLevel.load = function(savedData, questScript) {
    assert(savedData.ver === 1);
    assert(savedData.magic === QuestLevel.magic);

    var level = new QuestLevel(
        QuestLevel.loadName(savedData),
        questScript,
        savedData.status
    );
    return level;
};

QuestLevel.loadName = function(savedData) {
    assert(savedData.ver === 1);
    assert(savedData.magic === QuestLevel.magic);
    return savedData.name;
};
