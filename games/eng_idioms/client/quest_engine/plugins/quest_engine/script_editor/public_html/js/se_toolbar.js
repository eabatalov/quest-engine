function ToolBarItem(type, label) {

    this.type = type;
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

ToolbarWindowController = function($scope, seEventRouter, $timeout) {
    seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);

    $scope.toolbarItems = [
            new ToolBarItem(_QUEST_NODES.ANIM),
            new ToolBarItem(_QUEST_NODES.PHRASE),
            new ToolBarItem(_QUEST_NODES.QUIZ),
            new ToolBarItem(_QUEST_NODES.STAGE),
            new ToolBarItem(_QUEST_NODES.STAGE_CLEAR),
            new ToolBarItem(_QUEST_NODES.STORYLINE),
            new ToolBarItem(_QUEST_NODES.WAIT),
            new ToolBarItem(_QUEST_NODES.NONE)
    ];

    $scope.itemClicked = function(toolbarItem) {
        //XXX make work with stage more intuitive
        if (toolbarItem.type === _QUEST_NODES.STAGE)
            return;

        var evName = toolbarItem.isActive ? "TOOLBAR_ITEM_DEACTIVATE_CLICK" : "TOOLBAR_ITEM_ACTIVATE_CLICK";
        seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_CURRENT_STAGE, { name : evName, item : toolbarItem, type : toolbarItem.type });
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
    seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "CNTRL_INIT_TOOLBAR" });
};

function ToolbarStaticConstructor(completionCB) {
    completionCB();
}
