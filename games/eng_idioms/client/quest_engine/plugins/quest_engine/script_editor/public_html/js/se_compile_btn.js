CompileBtnController = function($scope, seEventRouter) {
    var seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    $scope.compileClicked = function() {
        seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES, { name : "COMPILE" });
    };
};
