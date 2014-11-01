/*
 * Hides asynchronous nature of realtime replay sending
 */
function ReplayRealTimeSender() {
    this._syncWithClientStateHandler =
        this._onSyncWithClientState.bind(this);
    this._levelHistoryRecordAddedHandler = null;

    this._client = new ReplayClientSession();
    this._state = ReplayRealTimeSender._STATES.IDLE;
    this._pendingRecords = [];
    this._currentLevelName = null;

    this._schedSyncWithClientState();
}

ReplayRealTimeSender._STATES = {
    UNREC_ERROR : -1,
    IDLE : 1,
    REPLAY_START_PENDING : 2,
    REPLAY_STARTED : 3
};

ReplayRealTimeSender.prototype.startNewReplay = function(levelHistory, levelName) {
    if (this._state !== ReplayRealTimeSender._STATES.IDLE)
        return;

    this._fillExistingRecordsFromHistory(levelHistory);
    this._levelHistoryRecordAddedHandler =
        levelHistory.events.recordAdded.
        subscribe(this, this._onLevelHistoryRecordAdded);

    this._currentLevelName = levelName;
    this._state = ReplayRealTimeSender._STATES.REPLAY_START_PENDING;
};

ReplayRealTimeSender.prototype.finishReplay = function() {
    if (this._state !== ReplayRealTimeSender._STATES.REPLAY_STARTED)
        return;

    this._levelHistoryRecordAddedHandler.delete();
    this._sendPendingRecords();
    this._client.finishReplay();
    this._state = ReplayRealTimeSender._STATES.IDLE;
};

ReplayRealTimeSender.prototype._onLevelHistoryRecordAdded = function(record) {
    this._pendingRecords.push(record);
    this._sendPendingRecords();
};

ReplayRealTimeSender.prototype._fillExistingRecordsFromHistory = function(levelHistory) {
    for(var recIx = 0; recIx < levelHistory.recCnt(); ++i) {
        var record = levelHistory.recAt(recIx);
        this._pendingRecords.push(record);
    }
};

ReplayRealTimeSender.prototype._sendPendingRecords = function() {
    if (this._state !== ReplayRealTimeSender._STATES.REPLAY_STARTED)
        return;

    //Don't buf the records as we want the freshest data
    this._client.sendReplayRecordList(this._pendingRecords);
    this._pendingRecords = [];
};

ReplayRealTimeSender.prototype._onSyncWithClientState = function() {
    switch(this._state) {
        case ReplayRealTimeSender._STATES.IDLE:
        break;
        case ReplayRealTimeSender._STATES.REPLAY_START_PENDING:
            if (this._client.getState() ===
                ReplayClientSession.STATES.WAIT_REPLAY_START) {
                this._client.startNewReplay(this._currentLevelName);
            } else if (this._client.getState() ===
                ReplayClientSession.STATES.ACCEPTING_RECORDS) {
                this._state = ReplayRealTimeSender._STATES.REPLAY_STARTED;
                this._sendPendingRecords();
            }
        case ReplayRealTimeSender._STATES.REPLAY_STARTED:
            if (this._client.getState() ===
                ReplayRealTimeSender._STATES.NOT_READY) {
                //Abnormal change of state. Replay session is lost.
                console.error("Replay session is broken for some reason");
                this._state = ReplayRealTimeSender._STATES.UNREC_ERROR;
            }
        break;
    }

    this._schedSyncWithClientState();
};

ReplayRealTimeSender.prototype._schedSyncWithClientState = function() {
    setTimeout(this._syncWithClientStateHandler, 4 * 1000);
};

// ====
function createReplayRealTimeSender() {
    //TODO use this factory func to disable ReplayRealTimeSender
    //on configuration which doesn't require it
    return new ReplayRealTimeSender();
};
