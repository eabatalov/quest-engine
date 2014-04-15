function SaveLoadController($scope, seEventRouter) {
    var seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);

    $scope.saveClick = function() {
        seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PROJECT_SAVE_CLICK" });
    };

    $scope.loadClick = function() {
        $("#projectFileInput").click();
    };

    $("#projectFileInput").change(function() {
        /* Doesn't work with IE9
         * http://caniuse.com/#search=xhr
         */
        var projectFileForm = $('#projectFileForm')[0];
        var projectFileInput = $('#projectFileInput')[0];
        var projectFile = projectFileInput.files[0];
        if (projectFile == undefined)
            return;

        var reader = new FileReader();
        reader.readAsText(projectFile, 'UTF-8');
        reader.onload = function(event) {
            var projectSavedJSON = event.target.result;
            var fileName = projectFile.name;
            projectFileForm.reset();
            seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PROJECT_FILE_LOADED", json : projectSavedJSON });
        }
    });
}
