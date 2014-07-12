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
    if (this.levels.hasOwnProperty(levelName) &&
        this.pendingRequests.hasOwnProperty(levelName))
        return;

    this.pendingRequests[levelName] = true;
    this.levelLoader.load(levelName, function(level) {
        if (!this.pendingRequests[levelName]) {
            console.info('Unexpected deletion of pending request');
            return;
        }

        this.levels[levelName] = level;
        delete this.pendingRequests[levelName];

        this.signalAllPendingRequestsCompletion();
    }.bind(this));
};

LevelRepository.prototype.delLevel = function(levelName) {
    assert(this.levels.hasOwnProperty(levelName) ||
        this.pendingRequests.hasOwnProperty(levelName));

    delete this.levels[levelName];
    delete this.pendingRequests[levelName];
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

LevelRepository.prototype.signalAllPendingRequestsCompletion = function() {
    if (jQuery.isEmptyObject(this.pendingRequests) &&
        this.allPendingRequestsCompletionWaiters.length) {

        jQuery.each(this.allPendingRequestsCompletionWaiters, function(ix, callback) {
            callback();
        });

        this.allPendingRequestsCompletionWaiters = [];
    }
};

LevelRepository.prototype.waitAllPendingRequests = function(callback) {
    if (jQuery.isEmptyObject(this.pendingRequests)) {
        callback();
    } else {
        this.allPendingRequestsCompletionWaiters.push(callback);
    }
};

LevelRepository.magic = "oeth4L";

LevelRepository.prototype.save = function() {
    var savedData = {
        ver : 1,
        magic : LevelRepository.magic,
        levelNames : jQuery.map(this.levels, function(level, levelName) {
            return levelName;
        }),
        pendingRequests : this.pendingRequests
    };
    return savedData;
};

LevelRepository.load = function(savedData, levelLoader) {
    assert(savedData.ver === 1);
    assert(savedData.magic === LevelRepository.magic);

    var result = new LevelRepository(levelLoader);
    jQuery.each(savedData.levelNames, function(ix, levelName) {
        result.addLevel(levelName);
    });
    jQuery.each(savedData.pendingRequests, function(ix, levelName) {
        result.addLevel(levelName);
    });
    return result;
};
