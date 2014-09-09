function ReplayClientSession() {
    this._sock = require('socket.io-client')(REPLAY_CLIENT_CONFIG.SERVER_URL);
    this._sock.on('connect', this._onClientConnected.bind(this));
    this._sock.on('ok', this._onClientOk.bind(this));
    this._sock.on('disconnect', this._onClientDisconnected.bind(this));

    this._isConnected = false;
    this._state = ReplayClientSession._STATES.DISCONNECTED;
    this._onReady = new SEEvent();
}

ReplayClientSession.prototype.isReady = function() {
    return this._isConnected &&
        this._state > ReplayClientSession._STATES.AUTH_PENDING;
};

ReplayClientSession.prototype.onReady = function(thiz, callback) {
    //XXX Not implemented well
    if (this.isReady())
        callback.call(thiz);
    this._onReady.subscribe(thiz, callback);
};

ReplayClientSession.prototype.startNewReplay = function() {
    if (this._state !== ReplayClientSession._STATES.WAIT_REPLAY_START)
        return;
    this._state = ReplayClientSession._STATES.SENDING_REPLAY;
    this._sock.emit('replay_start');
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
};

ReplayClientSession._STATES = {
    DISCONNECTED : 1,
    AUTH_PENDING : 2,
    CLIENT_INFO_PENDING : 3,
    WAIT_REPLAY_START : 4,
    SENDING_REPLAY : 5
};

ReplayClientSession.prototype._onClientConnected = function() {
    console.log("Client connected");
    this._isConnected = true;
    this._state = ReplayClientSession._STATES.AUTH_PENDING;
    //AUTH
    var authMsg =
        new REPLAY_SESSION_PROTOCOL.AuthMessage(REPLAY_SESSION_PROTOCOL.AUTH_MAGIC);
    var authMsgStr = JSON.stringify(authMsg);
    this._sock.emit('auth', authMsgStr);
    //CLIENT INFO
    this._sock.emit('rep_client_info');
};

ReplayClientSession.prototype._onClientDisconnected = function() {
    console.log("Client disconnected");
    this._isConnected = false;
};

ReplayClientSession.prototype._onClientOk = function(data) {
    console.log('ok', data);
    switch(this._state) {
        case ReplayClientSession._STATES.AUTH_PENDING:
            this._state = ReplayClientSession._STATES.CLIENT_INFO_PENDING;
        break;
        case ReplayClientSession._STATES.CLIENT_INFO_PENDING:
            this._state = ReplayClientSession._STATES.WAIT_REPLAY_START;
            this._onReady.publish();
        break;
    }
};
