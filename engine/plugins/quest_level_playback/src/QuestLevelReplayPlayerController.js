function QuestLevelReplayPlayerController(level, questLevelReplayPlayer, replayLoader) {
    LevelReplayPlayerController.call(this, questLevelReplayPlayer, replayLoader);

    this.level = level;
    this.events.levelReplayLoaded = new SEEvent();
}

QuestLevelReplayPlayerController.prototype = new LevelReplayPlayerController(null, null);

QuestLevelReplayPlayerController.prototype.getPlaybackPosMin = function() {
    var posMs = this.levelReplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return Math.floor(posSec / 60);
};

QuestLevelReplayPlayerController.prototype.getPlaybackPosSec = function() {
    var posMs = this.levelReplayPlayer.getPositionMs();
    var posSec = Math.floor(posMs / 1000);
    return posSec % 60;
};

QuestLevelReplayPlayerController.prototype.getPlaybackSpeed = function() {
    var speedRounded = Math.round(this.levelReplayPlayer.getSpeed() * 100) / 100;
    return 'x' + speedRounded.toString();
};

QuestLevelReplayPlayerController.prototype.load = function() {
    this.replayLoader.load(this.level);
};

QuestLevelReplayPlayerController.prototype._onLevelReplayLoaded = function(replay) {
    LevelReplayPlayerController.prototype._onLevelReplayLoaded.call(this, replay);
    this.events.levelReplayLoaded.publish();
};
