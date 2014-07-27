function AjaxServerLevelGameplayHistorySaver(saveServerUrl) {
    ILevelGameplayHistorySaver.call(this);
    this.saveServerUrl = saveServerUrl;
}

AjaxServerLevelGameplayHistorySaver.prototype = new ILevelGameplayHistorySaver();

AjaxServerLevelGameplayHistorySaver.prototype.save = function(levelGameplayHistory, level) {
    var data = {
        level_name : level.getName(),
        gameplay_history : JSON.stringify(levelGameplayHistory.save())
    };
    /* Don't divulge our URL here
     * console.log('Sending level gameplay history to ', this.saveServerUrl);
     */
    jQuery.post(this.saveServerUrl, data);
};
