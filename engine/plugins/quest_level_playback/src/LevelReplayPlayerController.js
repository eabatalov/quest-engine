function LevelReplayPlayerController(level, levelReplayPlayer, replayLoader) {
    this.pendingCommands = [];
    this.handlers = [];

    this.level = level;

    this.replayLoader = replayLoader;
    this.handlers.push(this.replayLoader.events.
        replayLoaded.subscribe(this, this._onLevelReplayLoaded));

    this.levelReplayPlayer = levelReplayPlayer;
    this.levelReplayPlayer.events.
        changePlayerPos.subscribe(this, this._onChangePlayerPos);
    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/),
        levelReplayLoaded : new SEEvent()
    }
}

LevelReplayPlayerController.prototype.delete = function() {
    jQuery.each(this.handlers, collectionObjectDelete);
    this.levelReplayPlayer.stop();
};

LevelReplayPlayerController.ChangePlayerPosCommand = function(x, y) {
    this.x = x;
    this.y = y;
};

LevelReplayPlayerController.prototype.playerPosChangeProcCompleted = function() {
    this.pendingCommands.shift();
    if (this.pendingCommands.length > 0) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};

LevelReplayPlayerController.prototype.getPlayerX = function() {
    return this.pendingCommands[0].x;
};

LevelReplayPlayerController.prototype.getPlayerY = function() {
    return this.pendingCommands[0].y;
};

LevelReplayPlayerController.prototype.play = function() {
    this.levelReplayPlayer.play();
};

LevelReplayPlayerController.prototype.stop = function() {
    this.levelReplayPlayer.stop();
};

LevelReplayPlayerController.prototype.getPlaybackPosMin = function() {
    var posMs = this.levelReplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return Math.floor(posSec / 60);
};

LevelReplayPlayerController.prototype.getPlaybackPosSec = function() {
    var posMs = this.levelReplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return posSec % 60;
};

LevelReplayPlayerController.prototype.getPlaybackSpeed = function() {
    var speedRounded = Math.round(this.levelReplayPlayer.getSpeed() * 100) / 100;
    return 'x' + speedRounded.toString();
};

LevelReplayPlayerController.prototype.speedUp = function() {
    this.levelReplayPlayer.speedUp();
};

LevelReplayPlayerController.prototype.speedDown = function() {
    this.levelReplayPlayer.speedDown();
};

LevelReplayPlayerController.prototype.load = function() {
    this.replayLoader.load(this.level);
};

LevelReplayPlayerController.prototype._onLevelReplayLoaded = function(replay) {
    this.levelReplayPlayer.setReplay(replay);
    this.events.levelReplayLoaded.publish();
};

LevelReplayPlayerController.prototype._onChangePlayerPos = function(x, y) {
    this.pendingCommands.push(
        new LevelReplayPlayerController.ChangePlayerPosCommand(x, y)
    );
    if (this.pendingCommands.length === 1) {
        this.events.changePlayerPos.publish(this.pendingCommands[0]);        
    }
};
