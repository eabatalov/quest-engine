function ScriptPropsController($scope, seEventRouter, seService, $timeout) {
    var seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    $scope.script = null;

    function safeDigest() {
        $timeout(function() {
            $scope.$digest
        });
    }

    seEvents.on(function(msg) {
        if (msg.name === "SCRIPT_CHANGED") {
            $scope.script = seService.getSE().getScript();
            safeDigest();
        }
    }, null);

    seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "CNTRL_INIT_SCPROPS_WIND" });
}
