function WebDOMLocalFSGameplayHistoryLoader() {
    this.events = {
        historyLoaded : new SEEvent(/*LevelGameplayHistory*/)
    };
}

WebDOMLocalFSGameplayHistoryLoader.prototype.load = function() {
    this._createFileOpenButton();
};

WebDOMLocalFSGameplayHistoryLoader.prototype._onFileLoaded = function(data) {
    var historySavedData = JSON.parse(data);
    var loadedHistory = LevelGameplayHistory.load(historySavedData);
    this.events.historyLoaded.publish(loadedHistory);
};

WebDOMLocalFSGameplayHistoryLoader.prototype._createFileOpenButton = function() {
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
