function LevelGameplayPlayerController(levelGameplayPlayer) {
    this.pendingCommands = [];

    this.levelGameplayPlayer = levelGameplayPlayer;
    this.levelGameplayPlayer.events.
        changePlayerPos.subscribe(this, this._onChangePlayerPos);
    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/)
    };
    //XXX
    var histLoader = new LevelGameplayHistoryLoader();
    this.levelGameplayPlayer.setLevelHist(histLoader.load());
}

LevelGameplayPlayerController.ChangePlayerPosCommand = function(x, y) {
    this.x = x;
    this.y = y;
};

LevelGameplayPlayerController.prototype._onChangePlayerPos = function(x, y) {
    this.pendingCommands.push(
        new LevelGameplayPlayerController.ChangePlayerPosCommand(x, y)
    );
    if (this.pendingCommands.length === 1) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};

LevelGameplayPlayerController.prototype.playerPosChangeProcCompleted = function() {
    this.pendingCommands.pop();
    if (this.pendingCommands.length > 0) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};

LevelGameplayPlayerController.prototype.getPlayerPosX = function() {
    return this.pendingCommands[0].x;
};

LevelGameplayPlayerController.prototype.getPlayerPosY = function() {
    return this.pendingCommands[0].y;
};

LevelGameplayPlayerController.prototype.play = function() {
    this.levelGameplayPlayer.play();
};

LevelGameplayPlayerController.prototype.stop = function() {
    this.levelGameplayPlayer.stop();
};
