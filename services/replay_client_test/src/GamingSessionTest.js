function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var MAX_REPLAY_TIME_MS = 2 * 60 * 1000; //2 mins

function GamingSessionTest() {
    console.log("new GamingSessionTest()");
    this.onSendNewRecordsListHandler =
        this.onSendNewRecordsList.bind(this);
    this.session = new ReplayClientSession();
    //XXX TODO This method isn't exist anymore need to update
    //the test ti use newer codebase
    this.session.onReady(this, this.onReplayClientSessionReady);
}

GamingSessionTest.prototype.onReplayClientSessionReady = function() {
    console.log("GamingSessionTest.onReplayClientSessionReady");
    this.session.startNewReplay();
    this.schedSendRecordList();
    this.schedSessionFinish();
};

GamingSessionTest.prototype.schedSendRecordList = function() {
    setTimeout(this.onSendNewRecordsListHandler, randomInt(1, 1000));
};

GamingSessionTest.prototype.schedSessionFinish = function() {
    setTimeout(function() {
        this.session.finishReplay();
    }.bind(this), randomInt(1 * 1000, MAX_REPLAY_TIME_MS));
};

GamingSessionTest.prototype.onSendNewRecordsList = function() {
    for (var x = 0; x < 1000; x +=13) {
        recList = [];
        for (var y = 0; y < 1000; y += 100) {
            recList.push(new PlayerPositionRecord(x, y));
        }
        this.session.sendReplayRecordList(recList);
    }
    this.schedSendRecordList();
};
