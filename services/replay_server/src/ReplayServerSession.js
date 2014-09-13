function onClientConnected(cliSock) {
    new ReplayServerSession(cliSock);
}

function ReplayServerSession(cliSock) {
    this.id = ReplayServerSession.idCntr++;
    this.logInfo("starting");

    this.sock = cliSock;
    this.state = ReplayServerSession.STATES.AUTH_PENDING;
    this.replayCollector = null;

    this.sock.on('disconnect', this.onClientDisconnected.bind(this));
    this.sock.on('auth', this.onClientAuth.bind(this));
    this.sock.on('replay_start', this.onClientReplayStart.bind(this));
    this.sock.on('rep_info', this.onClientReplayInfo.bind(this));
    this.sock.on('rep_rec_list', this.onClientReplayRecordList.bind(this));
    this.sock.on('replay_finish', this.onClientReplayFinish.bind(this));

    this.addToActiveList();
    this.logInfo("started");
}

ReplayServerSession.idCntr = 0;
ReplayServerSession.activeSessions = [];
ReplayServerSession.STATES = {
    AUTH_PENDING : 1,
    WAIT_REPLAY_START : 2,
    WAIT_REPLAY_INFO : 3,
    COLLECTING_REPLAY : 4,
    FINISHING : 5,
    FINISHED : 6
};
//AUTH_PENDING -> 
//    WAIT_REPLAY_START -> WAIT_REPLAY_INFO -> COLLECTING_REPLAY (loop)
//* -> FINISHING -> FINISHED
ReplayServerSession.prototype.addToActiveList = function() {
    ReplayServerSession.activeSessions.push(this);
    this.logInfo("Active sessions count: "
        + ReplayServerSession.activeSessions.length.toString());
};

ReplayServerSession.prototype.removeFromActiveList = function() {
    for (var i = 0; i < ReplayServerSession.activeSessions.length; ++i) {
        var session = ReplayServerSession.activeSessions[i];
        if (session.id !== this.id)
            continue;
        ReplayServerSession.activeSessions.splice(i, 1);
        break;
    }
    this.logInfo("Active sessions count: "
        + ReplayServerSession.activeSessions.length.toString());
};

ReplayServerSession.prototype.finish = function() {
    this.logInfo("finishing");

    this.state = ReplayServerSession.STATES.FINISHING;
    this.removeFromActiveList();
    delete this.sock;
    if (this.replayCollector) {
        this.replayCollector.finish(false);
    }
    delete this.replayCollector;
    this.state = ReplayServerSession.STATES.FINISHED;

    this.logInfo("finished");
};

ReplayServerSession.prototype.onClientAuth = function(data) {
    this.logInfo("Client is authenticating");
    this.logInfo(data);
    if (this.state !== ReplayServerSession.STATES.AUTH_PENDING)
        return;

    var authMsg = REPLAY_SESSION_PROTOCOL.AuthMessage.load(JSONSafeParse(data));
    if (!authMsg)
        return this.finish();

    if (authMsg.magic !== REPLAY_SESSION_PROTOCOL.AUTH_MAGIC)
        return this.finish();

    this.state = ReplayServerSession.STATES.WAIT_REPLAY_START;
    this.sock.emit('ok', 'auth');
    this.logInfo("Client is authenticated");
};

ReplayServerSession.prototype.onClientReplayStart = function() {
    this.logInfo("Replay starting");
    if (this.state !== ReplayServerSession.STATES.WAIT_REPLAY_START)
        return;

    this.state = ReplayServerSession.STATES.WAIT_REPLAY_INFO;
    this.logInfo("Replay started");
};

ReplayServerSession.prototype.onClientReplayInfo = function(data) {
    this.logInfo("Client replay info recieved");
    this.logInfo(data);
    if (this.state !== ReplayServerSession.STATES.WAIT_REPLAY_INFO)
        return;

    var repInfoMsg = REPLAY_SESSION_PROTOCOL.ReplayInfoMessage.load(JSONSafeParse(data));
    if (!repInfoMsg)
        return this.finish();

    var replayInfo = repInfoMsg.getReplayInfo();
    try {
        replayInfo.setHostName(this.sock.request.connection.remoteAddress);
    } catch(ex) {
        this.logError("Couldn't get client ip address");
        this.logError(ex.toString());
    }

    this.replayCollector = new ReplayServerSession.ReplayCollector(replayInfo);
    this.state = ReplayServerSession.STATES.COLLECTING_REPLAY;
    this.sock.emit('ok', 'client info');
    this.logInfo("Client replay info processed");
};


ReplayServerSession.prototype.onClientReplayRecordList = function(data) {
    if (this.state !== ReplayServerSession.STATES.COLLECTING_REPLAY)
        return;

    var recListMsg = REPLAY_SESSION_PROTOCOL.RecordListMessage.load(JSONSafeParse(data));
    if (!recListMsg)
        return this.finish();

    this.replayCollector.replayRecordListReady(recListMsg.getRecordList());
};

ReplayServerSession.prototype.onClientReplayFinish = function() {
    this.logInfo("Replay finishing");
    if (this.state !== ReplayServerSession.STATES.COLLECTING_REPLAY)
        return;

    this.replayCollector.finish(true);
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

ReplayServerSession.prototype.logError = function(str) {
    logger.error("Session %d: %s", this.id, str);
};
