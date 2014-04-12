var scriptEditorApp = null;

/* Execution time dependent bootstrap code */
function ScriptEditorBootstrap() {

/*
 * ScriptEditor app bootstrap code.
 * Performs all the sync/async initialization first and then
 * starts the app.
 */
/* Execution time independent bootstrap code */
scriptEditorApp = angular.module('ScriptEditorApp', []);

scriptEditorApp.config(function() {
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}).config(SEObjectConfig);

scriptEditorApp.run(["ScriptEditorService",
    function(scriptEditorService) {
       this.service = scriptEditorService;
    }
]);

scriptEditorApp.filter('hasFieldValue', function() {
    return function(value) {
        if (value !== null && value !== undefined) {
                return true;
            } else
                return false;
    };
});

scriptEditorApp.factory('SEEventRouter', [SEEventRouterFactory]);

scriptEditorApp.factory("MouseWheelManager", [MouseWheelManagerFactory]);

scriptEditorApp.factory("SEUserInteractionManager", ["SEEventRouter", SEUserInteractionManagerFactory]);

scriptEditorApp.factory("ScriptEditorService", ["SEEventRouter", "MouseWheelManager", "SEUserInteractionManager",
    ScriptEditorServiceFactory]);

scriptEditorApp.controller("ScriptEditorPropertiesWindowController", ['$scope', 'SEEventRouter', '$timeout',
    ScriptEditorPropertiesWindowController]);

scriptEditorApp.controller("ToolbarWindowController", ['$scope', 'SEEventRouter', '$timeout',
    ToolbarWindowController]);

scriptEditorApp.controller("CompileBtnController", ['$scope', 'SEEventRouter', CompileBtnController]);

scriptEditorApp.controller("StagesPanelController", ['$scope', 'SEEventRouter', 'ScriptEditorService', StagesPanelController]);

    this.staticConstructorsCnt = 8;
    var constrComplCB = this.onStaticConstrCompleted.bind(this);
    ScriptEditorStaticConstructor(constrComplCB);
    SEStageEditorStaticConstructor(constrComplCB);
    SENodeViewStaticConstructor(constrComplCB);
    SECondViewStaticConstructor(constrComplCB);
    ToolBarItemStaticConstructor(constrComplCB);
    ToolbarStaticConstructor(constrComplCB);
    SEInputManagerStaticConstructor(constrComplCB);
    SEStagesManagerStaticConstructor(constrComplCB);
}

$(document).ready(function() {
    seBootstrap = new ScriptEditorBootstrap();
});

ScriptEditorBootstrap.prototype.onStaticConstrCompleted = function() {
    this.staticConstructorsCnt -= 1;
    if (this.staticConstructorsCnt > 0)
        return;

    angular.bootstrap(document.body, [scriptEditorApp.name]);
};
