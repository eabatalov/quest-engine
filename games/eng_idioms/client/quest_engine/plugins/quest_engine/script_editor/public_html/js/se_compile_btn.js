CompileBtnController = function($scope, seEventRouter) {
    var seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    $scope.compileClicked = function() {
        seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "COMPILE" });
    };
    seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "CNTRL_INIT_COMPILE_BTN" });
};
