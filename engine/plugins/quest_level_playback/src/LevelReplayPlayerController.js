function LevelReplayPlayerController(levelReplayPlayer, replayLoader) {
    if (!levelReplayPlayer && !replayLoader)
        return; //Subclass prototype construction

    this.pendingRecordsQueue = new CommandQueue();
    this.handlers = [];

    this.replayLoader = replayLoader;
    this.levelReplayPlayer = levelReplayPlayer;
    this.events = {
        recPending : new SEEvent(/*LevelGameplayHistoryRecord*/)
    }

    this.handlers.push(this.replayLoader.events.
        replayLoaded.subscribe(this, this._onLevelReplayLoaded)
    );
    this.handlers.push(
        this.levelReplayPlayer.events.
            recReady.subscribe(this.pendingRecordsQueue, this.pendingRecordsQueue.enqueueCommand)
    );
    this.handlers.push(
        this.pendingRecordsQueue.onCommandPending(this, function(command) {
            this.events.recPending.publish(command);
        })
    );
}

LevelReplayPlayerController.prototype.delete = function() {
    jQuery.each(this.handlers, collectionObjectDelete);
    this.levelReplayPlayer.stop();
    this.pendingRecordsQueue.delete();
};

LevelReplayPlayerController.prototype.getPendingRecord = function() {
    return this.pendingRecordsQueue.getPendingCommand();
};

LevelReplayPlayerController.prototype.recProcCompleted = function() {
    this.pendingRecordsQueue.completePendingCommand();
};

LevelReplayPlayerController.prototype.play = function() {
    //console.log("play()");
    this.levelReplayPlayer.play();
};

LevelReplayPlayerController.prototype.stop = function() {
    //console.log("stop()");
    this.levelReplayPlayer.stop();
};

LevelReplayPlayerController.prototype.speedUp = function() {
    this.levelReplayPlayer.speedUp();
};

LevelReplayPlayerController.prototype.speedDown = function() {
    this.levelReplayPlayer.speedDown();
};

LevelReplayPlayerController.prototype._onLevelReplayLoaded = function(replay) {
    //console.log("_onLevelReplayLoaded");
    this.levelReplayPlayer.setReplay(replay);
};
