function StagesPanelController($scope, seEventRouter, scriptEditorService) {
    var thiz = this;

    $scope.isCurrent = function(stage) {
        return thiz.currenStage.getId() === stage.getId();
    };

    $scope.stages = function() {
        return thiz.stagesList;
    };

    $scope.newStage = function() {
        var name = "Stage " + thiz.stagesList.length;
        thiz.stagesList.push(new SEStage(name));
    };

    $scope.changeCurrent = function(stage) {
        thiz.currenStage = stage;
    };

    thiz.stagesList = [
        new SEStage("Stage 0")
    ];
    thiz.currenStage = thiz.stagesList[0];
}

function SEStagesManagerStaticConstructor(constrComplCB) {
    constrComplCB();
}
