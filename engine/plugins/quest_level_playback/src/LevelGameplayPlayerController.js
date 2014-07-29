function LevelGameplayPlayerController(levelGameplayPlayer, histLoader) {
    this.pendingCommands = [];
    this.handlers = [];

    this.histLoader = histLoader;
    this.handlers.push(this.histLoader.events.
        historyLoaded.subscribe(this, this._onLevelGameplayHistoryLoaded));

    this.levelGameplayPlayer = levelGameplayPlayer;
    this.levelGameplayPlayer.setLevelHist(new LevelGameplayHistory());
    this.levelGameplayPlayer.events.
        changePlayerPos.subscribe(this, this._onChangePlayerPos);
    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/),
        levelGameplayHistoryLoaded : new SEEvent()
    }
}

LevelGameplayPlayerController.prototype.delete = function() {
    jQuery.each(this.handlers, collectionObjectDelete);
    this.levelGameplayPlayer.stop();
};

LevelGameplayPlayerController.ChangePlayerPosCommand = function(x, y) {
    this.x = x;
    this.y = y;
};

LevelGameplayPlayerController.prototype.playerPosChangeProcCompleted = function() {
    this.pendingCommands.shift();
    if (this.pendingCommands.length > 0) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};

LevelGameplayPlayerController.prototype.getPlayerX = function() {
    return this.pendingCommands[0].x;
};

LevelGameplayPlayerController.prototype.getPlayerY = function() {
    return this.pendingCommands[0].y;
};

LevelGameplayPlayerController.prototype.play = function() {
    this.levelGameplayPlayer.play();
};

LevelGameplayPlayerController.prototype.stop = function() {
    this.levelGameplayPlayer.stop();
};

LevelGameplayPlayerController.prototype.getPlaybackPosMin = function() {
    var posMs = this.levelGameplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return Math.floor(posSec / 60);
};

LevelGameplayPlayerController.prototype.getPlaybackPosSec = function() {
    var posMs = this.levelGameplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return posSec % 60;
};

LevelGameplayPlayerController.prototype.getPlaybackSpeed = function() {
    var speedRounded = Math.round(this.levelGameplayPlayer.getSpeed() * 100) / 100;
    return 'x' + speedRounded.toString();
};

LevelGameplayPlayerController.prototype.speedUp = function() {
    this.levelGameplayPlayer.speedUp();
};

LevelGameplayPlayerController.prototype.speedDown = function() {
    this.levelGameplayPlayer.speedDown();
};

LevelGameplayPlayerController.prototype.load = function() {
    this.histLoader.load();
};

LevelGameplayPlayerController.prototype._onLevelGameplayHistoryLoaded = function(history) {
    this.levelGameplayPlayer.setLevelHist(history);
    this.events.levelGameplayHistoryLoaded.publish();
};

LevelGameplayPlayerController.prototype._onChangePlayerPos = function(x, y) {
    this.pendingCommands.push(
        new LevelGameplayPlayerController.ChangePlayerPosCommand(x, y)
    );
    if (this.pendingCommands.length === 1) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};
