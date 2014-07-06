function IPersistentStorage() {

}

/*
 * returns string from persistent storage by key
 * returns "" if key doesn't exist
 */
IPersistentStorage.prototype.get = function(key) {
    throw "Interface method not implemented";
};

/*
 * puts string to persistent storage
 * returns true on success
 * returns false on fail
 */
IPersistentStorage.prototype.put = function(key, value) {
    throw "Interface method not implemented";
};
