CompileBtnController = function($scope, seEvents) {
    $scope.compileClicked = function() {
        seEvents.broadcast({
            name : "COMPILE"
        });
    };
}
