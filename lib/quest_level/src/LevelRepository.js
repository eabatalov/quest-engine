/*
 * Implements QuestLevel repository services primarily.
 * But can work with any other object (subclass for example)
 * with the same interface. QuestLevel subclass is determined by
 * @levelLoader - instance of ILevelLoader.
 */
function LevelRepository(levelLoader) {
    this.pendingRequests = {};
    this.allPendingRequestsCompletionWaiters = [];
    this.levels = {};
    this.levelLoader = levelLoader;
}

LevelRepository.prototype.addLevel = function(levelName) {
    if (this.levels.hasOwnProperty(levelName) ||
        this.pendingRequests.hasOwnProperty(levelName))
        return;
    this._createLevel(levelName);
};

LevelRepository.prototype.delLevel = function(levelName) {
    if (!this.levels.hasOwnProperty(levelName) &&
        !this.pendingRequests.hasOwnProperty(levelName))
        return;

    this._delLevel(levelName);
};

LevelRepository.prototype.getLevelByName = function(levelName) {
    assert(this.levels[levelName]);

    return this.levels[levelName];
};

LevelRepository.prototype.getLevelCount = function() {
    if (Object.keys) { // ES5 
        return Object.keys(this.levels).length;
    }

    var count = 0, level;
    for (levelName in this.levels) {
        if (this.levels.hasOwnProperty(levelName)) {
            count += 1;
        }
    }

    return count;
};

LevelRepository.prototype.waitAllPendingRequests = function(callback) {
    if (jQuery.isEmptyObject(this.pendingRequests)) {
        callback();
    } else {
        this.allPendingRequestsCompletionWaiters.push(callback);
    }
};

// ==== PRIVATE ====
LevelRepository.prototype._createLevel = function(levelName) {
    this.pendingRequests[levelName] = true;
    this.levelLoader.create(levelName, function(level) {
        if (!this.pendingRequests[levelName]) {
            console.info('Unexpected deletion of pending request');
            return;
        }

        this.levels[levelName] = level;
        delete this.pendingRequests[levelName];

        this._signalAllPendingRequestsCompletion();
    }.bind(this));
};

LevelRepository.prototype._delLevel = function(levelName) {
    delete this.levels[levelName];
    delete this.pendingRequests[levelName];
};

LevelRepository.prototype._signalAllPendingRequestsCompletion = function() {
    if (jQuery.isEmptyObject(this.pendingRequests) &&
        this.allPendingRequestsCompletionWaiters.length) {

        jQuery.each(this.allPendingRequestsCompletionWaiters, function(ix, callback) {
            callback();
        });

        this.allPendingRequestsCompletionWaiters = [];
    }
};

// ==== SAVE/LOAD ====
LevelRepository.magic = "oeth4L";

LevelRepository.prototype.save = function() {
    var savedData = {
        ver : 1,
        magic : LevelRepository.magic,
        levels : jQuery.map(this.levels, function(level, levelName) {
            return level.save();
        }),
        pendingRequests : this.pendingRequests
    };
    return savedData;
};

LevelRepository.prototype._loadLevel = function(levelSavedData) {
    //Almost copypaste of _createLevel
    var levelName = QuestLevel.loadName(levelSavedData);
    this.pendingRequests[levelName] = true;
    this.levelLoader.load(levelSavedData, function(level) {
        if (!this.pendingRequests[levelName]) {
            console.info('Unexpected deletion of pending request');
            return;
        }

        this.levels[levelName] = level;
        delete this.pendingRequests[levelName];

        this._signalAllPendingRequestsCompletion();
    }.bind(this));
};

LevelRepository.load = function(savedData, levelLoader) {
    assert(savedData.ver === 1);
    assert(savedData.magic === LevelRepository.magic);

    var repo = new LevelRepository(levelLoader);
    jQuery.each(savedData.levels, function(levelName, levelSavedData) {
        repo._loadLevel(levelSavedData);
    });
    jQuery.each(savedData.pendingRequests, function(ix, levelName) {
        repo._createLevel(levelName);
    });
    return repo;
};
