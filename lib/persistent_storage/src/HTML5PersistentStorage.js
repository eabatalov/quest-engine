function HTML5PersistentStorage(storageId) {
    this._storageId = storageId;
}

HTML5PersistentStorage.prototype = new IPersistentStorage();
HTML5PersistentStorage.prototype.constructor = HTML5PersistentStorage;

HTML5PersistentStorage.prototype.get = function(key) {
    assert(typeof key === "string");

    try {
        var storage = this._getStorage();
        if (storage[key] === undefined)
           throw Error("No such key");
        return storage[key];
    } catch(e) {
        /* see put() comments */
        return "";
    }
};

HTML5PersistentStorage.prototype.put = function(key, value) {
    assert(typeof key === "string");
    assert(typeof value === "string");
    try {
        var storage = this._getStorage();
        storage[key] = value;
        this._updateStorage(storage);
        return true;
    } catch(e) {
        //Workaround iOS bug while browsing in "private" mode
        //http://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st
        //https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
        console.error("Write of key ", key, " with value ", e, " has failed");
        return false;
    }
};

//throws
HTML5PersistentStorage.prototype._getStorage = function() {
    var storage = window.localStorage.getItem(this._storageId);
    return storage == null ? {} : JSON.parse(storage);
};

//throws
HTML5PersistentStorage.prototype._updateStorage = function(storage) {
    window.localStorage.setItem(this._storageId, JSON.stringify(storage));
};
