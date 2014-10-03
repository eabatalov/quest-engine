function HTML5PersistentStorage() {

}

HTML5PersistentStorage.prototype = new IPersistentStorage();
HTML5PersistentStorage.prototype.constructor = HTML5PersistentStorage;

HTML5PersistentStorage.prototype.get = function(key) {
    assert(typeof key === "string");

    var value = null;
    try {
        value = window.localStorage.getItem(key);
    } catch(e) { /* see put() comments */ }
    return (value === null) ? "" : value;
};

HTML5PersistentStorage.prototype.put = function(key, value) {
    assert(typeof key === "string");
    assert(typeof value === "string");
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch(e) {
        //Workaround iOS bug while browsing in "private" mode
        //http://stackoverflow.com/questions/21159301/quotaexceedederror-dom-exception-22-an-attempt-was-made-to-add-something-to-st
        //https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
        console.error("Write of key ", key, " with value ", e, " has failed");
        return false;
    }
};
