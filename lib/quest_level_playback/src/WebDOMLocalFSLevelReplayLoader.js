function WebDOMLocalFSLevelReplayLoader() {
    ILevelReplayLoader.call(this);
    this.pendingLevel = null;
}

WebDOMLocalFSLevelReplayLoader.prototype = new ILevelReplayLoader();

WebDOMLocalFSLevelReplayLoader.prototype.load = function(level) {
    if (this.pendingLevel) {
        console.error("Can't start loading of new replay because replay ",
            "loading is already pending");
        return;
    }

    this.pendingLevel = level;
    this._createFileOpenButton();
};

WebDOMLocalFSLevelReplayLoader.prototype._onFileLoaded = function(data) {
    var replaySavedData = JSON.parse(data);
    var loadedHistory = LevelReplay.load(replaySavedData, this.pendingLevel);
    this.pendingLevel = null;

    this.events.replayLoaded.publish(loadedHistory);
};

WebDOMLocalFSLevelReplayLoader.prototype._createFileOpenButton = function() {
    //<input type="file" id="">
    var fileOpenBtn = document.createElement("input");
    fileOpenBtn.type = "file";
    fileOpenBtn.value = "";
    fileOpenBtn.id = "";
    jQuery(fileOpenBtn).change(function() {
         var historyFileInput = $(fileOpenBtn)[0];
         var historyFile = historyFileInput.files[0];
         if (historyFile == undefined) {
            console.error("Couldn't load level gameplay history file. Ask Eugene 'What da fuck?'");
            return;
         }
         var reader = new FileReader();
         reader.readAsText(historyFile, 'UTF-8');
         reader.onload = function(event) {
             this._onFileLoaded(event.target.result);
             fileOpenBtn.remove();
         }.bind(this);
    }.bind(this));

    jQuery('body').prepend(fileOpenBtn);
};
