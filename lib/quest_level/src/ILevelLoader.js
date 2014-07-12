function ILevelLoader() {

}

/*
 * Create new level with name @levelName.
 * @callback: function(level) to call on finish
 * returns: nothing
 */
ILevelLoader.prototype.create = function(levelName, callback) {
    throw "Interface method not implemented";
};

/*
 * Resotre (load) existing level state.
 * The name of the level is @levelName.
 * @callback: function(level) to call on finish
 * returns: nothing
 */
ILevelLoader.prototype.load = function(levelSavedData, callback) {
    throw "Interface method not implemented";
};
