function ReplayClientSession() {
    this._sock = io(REPLAY_CLIENT_CONFIG.SERVER_URL, {
        transports: ['websocket']
    });
    this._sock.on('connect', this._onClientConnected.bind(this));
    this._sock.on('ok', this._onClientOk.bind(this));
    this._sock.on('disconnect', this._onClientDisconnected.bind(this));

    this._state = ReplayClientSession._STATES.DISCONNECTED;
}

ReplayClientSession.prototype.startNewReplay = function(levelName) {
    if (this._state !== ReplayClientSession._STATES.WAIT_REPLAY_START)
        return;

    this._state = ReplayClientSession._STATES.REPLAY_INFO_PENDING;
    this._sock.emit('replay_start');

    //REPLAY INFO
    var repInfoMsg = new REPLAY_SESSION_PROTOCOL.ReplayInfoMessage(
        new LevelReplayInfo(levelName)
    );
    repInfoMsgStr = JSON.stringify(repInfoMsg.save());
    this._sock.emit('rep_info', repInfoMsgStr);
};

ReplayClientSession.prototype.sendReplayRecordList = function(recordList) {
    if (this._state !== ReplayClientSession._STATES.SENDING_REPLAY)
        return;

    var recListMsg = new REPLAY_SESSION_PROTOCOL.RecordListMessage(recordList);
    var recListMsgStr = JSON.stringify(recListMsg.save());
    this._sock.emit('rep_rec_list', recListMsgStr);
};

ReplayClientSession.prototype.finishReplay = function() {
    if (this._state !== ReplayClientSession._STATES.SENDING_REPLAY)
        return;

    this._sock.emit('replay_finish');
    this._state = ReplayClientSession._STATES.WAIT_REPLAY_START;
};

//External states
ReplayClientSession.STATES = {
    NOT_READY : 1,
    WAIT_REPLAY_START : 1,
    ACCEPTING_RECORDS : 2
};
//Get external state
ReplayClientSession.prototype.getState  = function() {
    switch(this._state) {
        case ReplayClientSession._STATES.DISCONNECTED:
        case ReplayClientSession._STATES.AUTH_PENDING:
        case ReplayClientSession._STATES.REPLAY_INFO_PENDING:
            return ReplayClientSession.STATES.NOT_READY;
        case ReplayClientSession._STATES.WAIT_REPLAY_START:
            return ReplayClientSession.STATES.WAIT_REPLAY_START;
        case ReplayClientSession._STATES.SENDING_REPLAY:
            return ReplayClientSession.STATES.ACCEPTING_RECORDS;
        default:
            assert(false, "ReplayClientSession internal state is valid");
    }
};

//Internal states
ReplayClientSession._STATES = {
    DISCONNECTED : 1,
    AUTH_PENDING : 2,
    WAIT_REPLAY_START : 3,
    REPLAY_INFO_PENDING : 4,
    SENDING_REPLAY : 5
};

ReplayClientSession.prototype._onClientConnected = function() {
    console.log("Client connected");
    if (this._state !== ReplayClientSession._STATES.DISCONNECTED)
        return;

    this._state = ReplayClientSession._STATES.AUTH_PENDING;
    //AUTH
    var authMsg =
        new REPLAY_SESSION_PROTOCOL.AuthMessage(REPLAY_SESSION_PROTOCOL.AUTH_MAGIC);
    var authMsgStr = JSON.stringify(authMsg.save());
    this._sock.emit('auth', authMsgStr);
};

ReplayClientSession.prototype._onClientDisconnected = function() {
    console.log("Client disconnected");
    this._state = ReplayClientSession._STATES.DISCONNECTED;
};

ReplayClientSession.prototype._onClientOk = function(data) {
    console.log('ok', data);
    switch(this._state) {
        case ReplayClientSession._STATES.AUTH_PENDING:
            this._state = ReplayClientSession._STATES.WAIT_REPLAY_START;
        break;
        case ReplayClientSession._STATES.REPLAY_INFO_PENDING:
            this._state = ReplayClientSession._STATES.SENDING_REPLAY;
        break;
    }
};
