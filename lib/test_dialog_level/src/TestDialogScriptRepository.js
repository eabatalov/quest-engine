function TestDialogScriptRepository(textFileLoader) {
    this._loader = new TestDialogScriptLoader(textFileLoader);
    this._scripts = {};
    this._pendingRequestCount = 0;
    this._allPendingRequestsCompletionWaiters = [];
}

TestDialogScriptRepository.prototype.addDialogScript = function(dialogName) {
    this._pendingRequestCount++;
    this._loader.load(dialogName, this._onScriptLoaded.bind(this));
};

TestDialogScriptRepository.prototype.getDialogScript = function(scriptName) {
    return this._scripts[scriptName];
};

TestDialogScriptRepository.prototype.waitAllPendingRequests = function(callback) {
    this._allPendingRequestsCompletionWaiters.push(callback);
    this._wakeWaiters();
};

TestDialogScriptRepository.prototype._onScriptLoaded = function(script) {
    this._scripts[script.getName()] = script;
    this._pendingRequestCount--;
    this._wakeWaiters();
};

TestDialogScriptRepository.prototype._wakeWaiters = function() {
    if (this._pendingRequestCount > 0)
        return;
    for (var i = 0; i < this._allPendingRequestsCompletionWaiters.length; ++i) {
        var waitHandler = this._allPendingRequestsCompletionWaiters[i];
        waitHandler();
    }
    this._allPendingRequestsCompletionWaiters = [];
}
