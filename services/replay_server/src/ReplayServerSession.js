function onClientConnected(cliSock) {
    new ReplayServerSession(cliSock);
}

function ReplayServerSession(cliSock) {
    this.id = ReplayServerSession.idCntr++;
    this.logInfo("starting");

    this.sock = cliSock;
    this.state = ReplayServerSession.STATES.AUTH_PENDING;
    this.replayCollector = null;
    this.clientInfo = null;

    this.sock.on('disconnect', this.onClientDisconnected.bind(this));
    this.sock.on('auth', this.onClientAuth.bind(this));
    this.sock.on('replay_start', this.onClientReplayStart.bind(this));
    this.sock.on('rep_client_info', this.onClientInfo.bind(this));
    this.sock.on('rep_rec_list', this.onClientReplayRecordList.bind(this));
    this.sock.on('replay_finish', this.onClientReplayFinish.bind(this));

    ReplayServerSession.activeSessions.push(this);
    this.logInfo("started");
}

ReplayServerSession.idCntr = 0;
ReplayServerSession.activeSessions = [];
ReplayServerSession.STATES = {
    AUTH_PENDING : 1,
    WAIT_CLIENT_INFO : 2,
    WAIT_REPLAY_START : 3,
    COLLECTING_REPLAY : 4,
    FINISHING : 5,
    FINISHED : 6
};
//AUTH_PENDING -> WAIT_CLIENT_INFO ->
//    WAIT_REPLAY_START -> COLLECTING_REPLAY (loop)
//* -> FINISHING -> FINISHED

ReplayServerSession.prototype.removeFromActiveList = function() {
    for (var i = 0; i < ReplayServerSession.activeSessions.length; ++i) {
        var session = ReplayServerSession.activeSessions[i];
        if (session.id !== this.id)
            continue;
        ReplayServerSession.activeSessions.splice(i, 1);
        break;
    }
};

ReplayServerSession.prototype.finish = function() {
    this.logInfo("finishing");

    this.state = ReplayServerSession.STATES.FINISHING;
    this.removeFromActiveList();
    delete this.sock;
    //TODO remove all the sock handlers
    this.state = ReplayServerSession.STATES.FINISHED;

    this.logInfo("finished");
};

ReplayServerSession.prototype.onClientAuth = function(data) {
    this.logInfo("Client is authenticating");
    if (this.state !== ReplayServerSession.STATES.AUTH_PENDING)
        return;

    var authMsg = REPLAY_SESSION_PROTOCOL.AuthMessage.load(JSONSafeParse(data));
    if (!authMsg)
        return this.finish();

    this.logInfo(authMsg.magic);
    if (authMsg.magic !== REPLAY_SESSION_PROTOCOL.AUTH_MAGIC)
        return this.finish();

    this.state = ReplayServerSession.STATES.WAIT_CLIENT_INFO;
    this.sock.emit('ok', 'auth');
    this.logInfo("Client is authenticated");
};

ReplayServerSession.prototype.onClientInfo = function(data) {
    this.logInfo("Client info recieved");
    if (this.state !== ReplayServerSession.STATES.WAIT_CLIENT_INFO)
        return;
    //TODO this.clientInfo = ...
    this.state = ReplayServerSession.STATES.WAIT_REPLAY_START;
    this.sock.emit('ok', 'client info');
    this.logInfo("Client info processed");
};

ReplayServerSession.prototype.onClientReplayStart = function() {
    this.logInfo("Replay starting");
    if (this.state !== ReplayServerSession.STATES.WAIT_REPLAY_START)
        return;

    this.state = ReplayServerSession.STATES.COLLECTING_REPLAY;
    this.replayCollector = new ReplayServerSession.ReplayCollector(this.clientInfo);
    this.logInfo("Replay started");
};

ReplayServerSession.prototype.onClientReplayRecordList = function(data) {
    //TODO comment for release not to spam the log
    this.logInfo("onClientReplayRecordList");
    this.logInfo(data);

    if (this.state !== ReplayServerSession.STATES.COLLECTING_REPLAY)
        return;

    var recListMsg = REPLAY_SESSION_PROTOCOL.RecordListMessage.load(JSONSafeParse(data));
    if (!recListMsg)
        return this.finish();

    this.replayCollector.replayRecordListReady(recListMsg.getRecordList());
    //TODO comment for release
    this.logInfo("onClientReplayRecordList - done");
};

ReplayServerSession.prototype.onClientReplayFinish = function() {
    this.logInfo("Replay finishing");
    if (this.state !== ReplayServerSession.STATES.COLLECTING_REPLAY)
        return;

    this.replayCollector.finish();
    this.replayCollector = null;
    this.state = ReplayServerSession.STATES.WAIT_REPLAY_START;

    this.logInfo("Replay finished");
};

ReplayServerSession.prototype.onClientDisconnected = function(data) {
    this.logInfo("Client is disconnected. Reason: ");
    this.logInfo(data);
    this.finish();
};

ReplayServerSession.prototype.logInfo = function(str) {
    logger.info("Session %d: %s", this.id, str);
};
