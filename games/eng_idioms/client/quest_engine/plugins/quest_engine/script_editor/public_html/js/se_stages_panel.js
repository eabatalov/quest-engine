function StagesPanelController($scope, seEventRouter, seService, $timeout) {
    this.timeout = $timeout;
    this.scope = $scope;
    this.seService = seService;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.seEvents.on(this.onSeEvent, this);

    $scope.isCurrent = function(stage) {
        return seService.getSE().getCurrentStage().getId() === stage.getId();
    };

    $scope.stages = function() {
        return seService.getSE().getScript().getStages();
    };

    $scope.newStageClick = function() {
        seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_NEW_CLICK" });
    };

    $scope.changeCurrentClick = function(stage) {
        seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_CHANGE_CLICK", stage : stage });
    };
}

StagesPanelController.prototype.safeDigest = function() {
    thiz = this;
    this.timeout(function() {
        thiz.scope.$digest();
    });
};

StagesPanelController.prototype.currentStagePropChanged = function(propName) {
    if (propName === "name") {
        this.safeDigest();
    }
};

StagesPanelController.prototype.onSeEvent = function(args) {
    if (args.name === "STAGE_CREATED") {
        //TODO implement unsubscription on stage deletion
        this.seService.getSE().getCurrentStage().getStageNode().events.
            propChanged.subscribe(this.currentStagePropChanged, this);
        this.safeDigest();
        return;
    }

    if (args.name === "STAGE_CHANGED") {
        this.safeDigest();
        return;
    }
};

function SEStagesManagerStaticConstructor(constrComplCB) {
    constrComplCB();
}
