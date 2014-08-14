function AjaxServerLevelReplaySaver(saveServerUrl) {
    ILevelReplaySaver.call(this);
    this.saveServerUrl = saveServerUrl;
}

AjaxServerLevelReplaySaver.prototype = new ILevelReplaySaver();

AjaxServerLevelReplaySaver.prototype.save = function(levelReplay) {
    var data = {
        level_name : levelReplay.getLevelName(),
        replay : JSON.stringify(levelReplay.save())
    };
    /* Don't divulge our URL here
     * console.log('Sending level replay to ', this.saveServerUrl);
     */
    jQuery.post(this.saveServerUrl, data);
};
