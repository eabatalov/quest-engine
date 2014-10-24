function ITextFileLoader() {

}

/*
 * Loads text file from platform specific storage.
 * @filePath: text file path
 * @callback: function(string) to call on finish
 * returns: nothing
 */
ITextFileLoader.prototype.load = function(filePath, callback) {
    throw "Interface method not implemented";
};
