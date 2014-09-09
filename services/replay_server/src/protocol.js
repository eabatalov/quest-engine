var REPLAY_SESSION_PROTOCOL = {
    AUTH_MAGIC : "2YlKMuIXJAwMO5EpZXxcgMy7GbB1G4",
    AuthMessage : null,
    RecordListMessage : null
};

// AUTH

REPLAY_SESSION_PROTOCOL.AuthMessage = function(magic) {
    this.magic = magic;
};

REPLAY_SESSION_PROTOCOL.AuthMessage.prototype.getMagic = function(){
    return this.magic;
};

REPLAY_SESSION_PROTOCOL.AuthMessage.prototype.save = function() {
    var savedData = {
        magic : this.magic
    };
    return savedData;
};

REPLAY_SESSION_PROTOCOL.AuthMessage.load = function(savedData) {
    if (savedData && savedData.magic) {
        return new REPLAY_SESSION_PROTOCOL.AuthMessage(savedData.magic);
    } else
        return null;
};

// RECORD LIST
REPLAY_SESSION_PROTOCOL.RecordListMessage = function(recordList) {
    this.recordList = recordList;
};

REPLAY_SESSION_PROTOCOL.RecordListMessage.prototype.getRecordList = function() {
    return this.recordList;
};

REPLAY_SESSION_PROTOCOL.RecordListMessage.prototype.save = function() {
    var savedData = {
        recordList : []
    };
    for (var i = 0; i < this.recordList.length; ++i) {
        var record = this.recordList[i];
        savedData.recordList.push({ type : record.getRecordType(), rec : record.save() });
    }
    return savedData;
};

REPLAY_SESSION_PROTOCOL.RecordListMessage.load = function(savedData) {
    if (!savedData || !savedData.recordList)
        return null;

    var recordList = [];
    for (var i = 0; i < savedData.recordList.length; ++i) {
        var savedRecord = savedData.recordList[i];
        var record = loadByRecType(savedRecord);
        recordList.push(record);
    }
    return new REPLAY_SESSION_PROTOCOL.RecordListMessage(recordList);

    function loadByRecType(recSaved) {
        var recLoader = LevelGameplayRecord.getRecTypeLoader(recSaved.type);
        return recLoader(recSaved.rec);
    };
};
