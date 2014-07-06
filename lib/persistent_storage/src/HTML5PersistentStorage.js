function HTML5PersistentStorage() {

}

HTML5PersistentStorage.prototype = new IPersistentStorage();
HTML5PersistentStorage.prototype.constructor = HTML5PersistentStorage;

HTML5PersistentStorage.prototype.get = function(key) {
    assert(typeof key === "string");
    var value = window.localStorage.getItem(key)
    return (value === null) ? "" : value;
};

HTML5PersistentStorage.prototype.put = function(key, value) {
    assert(typeof key === "string");
    assert(typeof value === "string");
    window.localStorage.setItem(key, value);
    return true;
};
