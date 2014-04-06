function ToolBarItem(type, seEvents, label) {

    this.type = type;
    this.seEvents = seEvents;
    this.isActive = false;
}

ToolBarItem.prototype.activate = function() {
    if (!this.isActive) {
        this.isActive = true;
    }
};

ToolBarItem.prototype.deactivate = function() {
    if (this.isActive) {
        this.isActive = false;
    }
};

ToolBarItem.prototype.imgUrl = function() {
    return ToolBarItem.DATA[this.type].iconUrl;
};

ToolBarItem.prototype.label = function() {
    return ToolBarItem.DATA[this.type].label;
}

ToolBarItem.prototype.equals = function(itemB) {
    return this.type === itemB.type;
};

function ToolBarItemStaticConstructor(completionCB) {
    function ItemConfig(iconUrl, label) { this.iconUrl = iconUrl; this.label = label; }
    ToolBarItem.DATA = {};
    ToolBarItem.DATA[_QUEST_NODES.ANIM] = new ItemConfig("images/nav/nav_anim.png", "Animation");
    ToolBarItem.DATA[_QUEST_NODES.PHRASE] = new ItemConfig("images/nav/nav_phrase.png", "Phrase");
    ToolBarItem.DATA[_QUEST_NODES.QUIZ] = new ItemConfig("images/nav/nav_quiz.png", "Quiz");
    ToolBarItem.DATA[_QUEST_NODES.STAGE] = new ItemConfig("images/nav/nav_stage.png", "Stage");
    ToolBarItem.DATA[_QUEST_NODES.STAGE_CLEAR] = new ItemConfig("images/nav/nav_stcl.png", "Clear");
    ToolBarItem.DATA[_QUEST_NODES.STORYLINE] = new ItemConfig("images/nav/nav_stln.png", "Storyline");
    ToolBarItem.DATA[_QUEST_NODES.WAIT] = new ItemConfig("images/nav/nav_wait.png", "Delay");
    ToolBarItem.DATA[_QUEST_NODES.NONE] = new ItemConfig("images/nav/nav_none.png", "Nothing");

    completionCB();
}

ToolbarWindowController = function($rootScope, $scope, seEvents, $timeout) {
    $scope.toolbarItems = [
            new ToolBarItem(_QUEST_NODES.ANIM, seEvents),
            new ToolBarItem(_QUEST_NODES.PHRASE, seEvents),
            new ToolBarItem(_QUEST_NODES.QUIZ, seEvents),
            new ToolBarItem(_QUEST_NODES.STAGE, seEvents),
            new ToolBarItem(_QUEST_NODES.STAGE_CLEAR, seEvents),
            new ToolBarItem(_QUEST_NODES.STORYLINE, seEvents),
            new ToolBarItem(_QUEST_NODES.WAIT, seEvents),
            new ToolBarItem(_QUEST_NODES.NONE, seEvents)
    ];

    $scope.initialized = function() {
        $rootScope.$emit("TOOLBAR_INITED");
    };

    $scope.itemClicked = function(toolbarItem) {
        //XXX make work with stage more intuitive
        if (toolbarItem.type === _QUEST_NODES.STAGE)
            return;

        var evName = toolbarItem.isActive ? "TOOLBAR_ITEM_DEACTIVATE_CLICK" : "TOOLBAR_ITEM_ACTIVATE_CLICK";
        seEvents.broadcast({ name : evName, item : toolbarItem, type : toolbarItem.type });
    };

    seEvents.on(function(args) {
        if (args.name === "TOOLBAR_ITEM_ACTIVATE") {
            $timeout(function() {
                $scope.$apply(function() {
                    var toolbarItem = args.item;
                    $.each($scope.toolbarItems, function(ix, item) {
                        if (toolbarItem.equals(item)) {
                            if (toolbarItem.isActive)
                                toolbarItem.deactivate();
                            else toolbarItem.activate();
                        } else {
                            item.deactivate();
                        }
                    });
                });
            });
            return;
        }

        if (args.name === "TOOLBAR_ITEM_DEACTIVATE") {
            $timeout(function() {
                    $scope.$apply(function() {
                        $.each($scope.toolbarItems, function(ix, item) {
                            item.deactivate();
                            });
                    });
            });
            return;
        }
    });
};

function ToolbarStaticConstructor(completionCB) {
    completionCB();
}
