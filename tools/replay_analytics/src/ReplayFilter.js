function ReplayFileInfoFilter(argv) {
    this._filterFuncs = [];

    this._parseArgv(argv);
}

ReplayFileInfoFilter._ARGV_ARGS = {
    LEVEL : "--level",
    HOST_NAME : "--host",
    IS_FINISHED : "--finished",
    DURATION : "--duration",
    TESTER_ID : "--tid",
    COINS : "--coins",
    PLATFORMER_GUESSED_IDIOMS : "--platformer_guessed_idioms",
    PLATFORMER_FAILED_IDIOMS : "--platformer_failed_idioms",
    TEST_DIALOG_RIGHT_ANSWERS : "--test_right_answers",
    TEST_DIALOG_WRONG_ANSWERS : "--test_wrong_answers",
    PLAYER_MIN_X : "--minx",
    PLAYER_MAX_X : "--maxx",
    PLAYER_MIN_Y : "--miny",
    PLAYER_MAX_Y : "--maxy"
};

ReplayFileInfoFilter.prototype._parseArgv = function(argv) {
    for (var i = 0; i < argv.length - 1; i+=2) {
        var filterArg = argv[i];
        var filterExpr = argv[i + 1];
        switch(filterArg) {
            case ReplayFileInfoFilter._ARGV_ARGS.LEVEL:
                this.applyLevelNameFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.HOST_NAME:
                this.applyHostNameFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.IS_FINISHED:
                this.applyIsFinishedFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.DURATION:
                this.applyDurationFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.TESTER_ID:
                this.applyTesterIdFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.COINS:
                this.applyCoinsCollectedNumberFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_GUESSED_IDIOMS:
                this.applyGuessedIdiomsFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_FAILED_IDIOMS:
                this.applyFailedIdiomsFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_X:
                this.applyPlayerMinXFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_X:
                this.applyPlayerMaxXFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_Y:
                this.applyPlayerMinYFilter(filterExpr);
                break;
            case ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_Y:
                this.applyPlayerMaxYFilter(filterExpr);
                break;
            default:
        };
    }
};

ReplayFileInfoFilter.getArgvHelp = function() {
    return [
        "[", ReplayFileInfoFilter._ARGV_ARGS.LEVEL, " level_name]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.HOST_NAME, " host_name]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.IS_FINISHED, " true|false]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.DURATION, " (eq|ls|gt)duration_sec]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.TESTER_ID, " tid]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.COINS, " (eq|ls|gt)coins_collected_num]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_GUESSED_IDIOMS, " (eq|ls|gt)guessed_idioms_num]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_FAILED_IDIOMS, " (eq|ls|gt)failed_idioms_num]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.TEST_DIALOG_RIGHT_ANSWERS, " (eq|ls|gt)right_answers_num]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.TEST_DIALOG_WRONG_ANSWERS, " (eq|ls|gt)wrong_answers_num]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_X, " (eq|ls|gt)min_player_x_position]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_X, " (eq|ls|gt)max_player_x_position]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_Y, " (eq|ls|gt)min_player_y_position]", "\n",
        "[", ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_Y, " (eq|ls|gt)max_player_y_position]", "\n",
        "example: ", "\n",
        ReplayFileInfoFilter._ARGV_ARGS.LEVEL, " 1demo ",
        ReplayFileInfoFilter._ARGV_ARGS.HOST_NAME, " 217.148.215.18 ",
        ReplayFileInfoFilter._ARGV_ARGS.IS_FINISHED, "true",
        ReplayFileInfoFilter._ARGV_ARGS.DURATION, " gt50 ",
        ReplayFileInfoFilter._ARGV_ARGS.TESTER_ID, " '' ",
        ReplayFileInfoFilter._ARGV_ARGS.COINS, " gt1 ",
        ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_GUESSED_IDIOMS, " gt0 ",
        ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_FAILED_IDIOMS, " gt0 ",
        ReplayFileInfoFilter._ARGV_ARGS.TEST_DIALOG_RIGHT_ANSWERS, " gt0 ",
        ReplayFileInfoFilter._ARGV_ARGS.TEST_DIALOG_WRONG_ANSWERS, " eq0 ",
        ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_X,, " ls500 ",
        ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_X, " gt5200",
        ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_Y, " gt0 ",
        ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_Y, " ls1000",
        "\n"
    ].join("");
};

ReplayFileInfoFilter.prototype.applyLevelNameFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var name = replayFileInfo.replay.getReplayInfo().getLevelName();
        return name == expr;
    });
};

ReplayFileInfoFilter.prototype.applyHostNameFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var name = replayFileInfo.replay.getReplayInfo().getHostName();
        return name == expr;
    });
};

ReplayFileInfoFilter.prototype.applyIsFinishedFilter = function(expr) {
   this._filterFuncs.push(function(replayFileInfo) {
        var isFinished = replayFileInfo.replay.getReplayInfo().getIsFinished();
        switch(expr) {
            case "true":
                return isFinished === true;
            break;
            case "false":
                return isFinished === false;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.IS_FINISHED, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyDurationFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayDurSec = Math.floor(
            replayFileInfo.replayAnalytics.getReplayDurationMS() / 1000
        );
        var targetDurSec = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayDurSec == targetDurSec;
            break;
            case "ls":
                return replayDurSec < targetDurSec;
            break;
            case "gt":
                return replayDurSec > targetDurSec;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.DURATION, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyTesterIdFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayTid = replayFileInfo.replayAnalytics.getTesterId();
        var targetTid = expr;
        return replayTid === targetTid;
    });
};

ReplayFileInfoFilter.prototype.applyCoinsCollectedNumberFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayCoins =
            replayFileInfo.replayAnalytics.getCoinsCollectedNum();
        var targetCoins = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayCoins == targetCoins;
            break;
            case "ls":
                return replayCoins < targetCoins;
            break;
            case "gt":
                return replayCoins > targetCoins;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.COINS, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyGuessedIdiomsFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayGuessed =
            replayFileInfo.replayAnalytics.getPlatformerGuessedIdiomsCount();
        var targetGuessed = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayGuessed == targetGuessed;
            break;
            case "ls":
                return replayGuessed < targetGuessed;
            break;
            case "gt":
                return replayGuessed > targetGuessed;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_GUESSED_IDIOMS, "filter:", expr);
        process.exit(1);
    });

};

ReplayFileInfoFilter.prototype.applyFailedIdiomsFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayFailed =
            replayFileInfo.replayAnalytics.getPlatformerFailedIdiomsCount();
        var targetFailed = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayFailed == targetFailed;
            break;
            case "ls":
                return replayFailed < targetFailed;
            break;
            case "gt":
                return replayFailed > targetFailed;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLATFORMER_FAILED_IDIOMS, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyPlayerMinXFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayMinX =
            replayFileInfo.replayAnalytics.getMinPlayerX();
        var targetMinX = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayMinX == targetMinX;
            break;
            case "ls":
                return replayMinX < targetMinX;
            break;
            case "gt":
                return replayMinX > targetMinX;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_X, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyPlayerMaxXFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayMaxX =
            replayFileInfo.replayAnalytics.getMaxPlayerX();
        var targetMaxX = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayMaxX == targetMaxX;
            break;
            case "ls":
                return replayMaxX < targetMaxX;
            break;
            case "gt":
                return replayMaxX > targetMaxX;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_X, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyPlayerMinYFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayMinY =
            replayFileInfo.replayAnalytics.getMinPlayerY();
        var targetMinY = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayMinY == targetMinY;
            break;
            case "ls":
                return replayMinY < targetMinY;
            break;
            case "gt":
                return replayMinY > targetMinY;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MIN_Y, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.applyPlayerMaxYFilter = function(expr) {
    this._filterFuncs.push(function(replayFileInfo) {
        var replayMaxY =
            replayFileInfo.replayAnalytics.getMaxPlayerY();
        var targetMaxY = parseInt(expr.substring(2));

        switch(expr.substring(0, 2)) {
            case "eq":
                return replayMaxY == targetMaxY;
            break;
            case "ls":
                return replayMaxY < targetMaxY;
            break;
            case "gt":
                return replayMaxY > targetMaxY;
            break;
        }
        console.error("Invalid expression for",
            ReplayFileInfoFilter._ARGV_ARGS.PLAYER_MAX_Y, "filter:", expr);
        process.exit(1);
    });
};

ReplayFileInfoFilter.prototype.isReplayFileInfoOk = function(replayFileInfo) {
    var isOk = true;
    jQuery.each(this._filterFuncs, function(ix, filterFunc) {
        isOk = isOk && filterFunc(replayFileInfo);
        return isOk;
    });
    return isOk;
};
