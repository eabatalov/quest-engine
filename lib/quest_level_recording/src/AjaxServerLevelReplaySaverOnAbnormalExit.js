// Special workaround for sending of level replay on close of browser tab ===
// The implementation is not clean and requires much more knowledge then usual
// ILevelReplaySaver implementation
function AjaxServerLevelReplaySaverOnAbnormalExit(saveServerUrl) {
    AjaxServerLevelReplaySaver.call(this, saveServerUrl);

    jQuery(window).unload(this._onAbnormalExit.bind(this));
}

AjaxServerLevelReplaySaverOnAbnormalExit.prototype = new AjaxServerLevelReplaySaver("");

AjaxServerLevelReplaySaverOnAbnormalExit.prototype._onAbnormalExit = function() {
    var currentLevelRuntime = QuestGame.instance.getCurrentLevelRuntime();
    if (!currentLevelRuntime)
        return;

    var replay = new LevelReplay(
        currentLevelRuntime.getLevelGameplayHistory(),
        currentLevelRuntime.getLevel(),
        true
    );
    this.save(replay);
    console.log("Sending level replay on abnormal exit");
};
