var scriptEditorApp = null;
var scriptEditorService = null;
var seEventRouter = new SEEventRouter();

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

scriptEditorApp.run([
    function() {
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

scriptEditorApp.value('SEEventRouter', seEventRouter);

scriptEditorApp.factory("MouseWheelManager", [MouseWheelManagerFactory]);

scriptEditorApp.factory("SEUserInteractionManager", ["SEEventRouter", SEUserInteractionManagerFactory]);

scriptEditorApp.controller("ScriptEditorPropertiesWindowController", ['$scope', 'SEEventRouter', '$timeout',
    ScriptEditorPropertiesWindowController]);

scriptEditorApp.controller("ToolbarWindowController", ['$scope', 'SEEventRouter', '$timeout',
    ToolbarWindowController]);

scriptEditorApp.controller("CompileBtnController", ['$scope', 'SEEventRouter', CompileBtnController]);

scriptEditorApp.controller("StagesPanelController", ['$scope', 'SEEventRouter', 'ScriptEditorService', '$timeout',
    StagesPanelController]);

scriptEditorApp.controller("SaveLoadController", ['$scope', 'SEEventRouter', SaveLoadController]);

scriptEditorApp.factory("ScriptEditorService", [
    "SEEventRouter",
    "MouseWheelManager",
    "SEUserInteractionManager",
    ScriptEditorServiceFactory
]);

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
    var seBootstrap = new ScriptEditorBootstrap();
});

ScriptEditorBootstrap.prototype.onStaticConstrCompleted = function() {
    this.staticConstructorsCnt -= 1;
    if (this.staticConstructorsCnt > 0)
        return;
    /*
     * All the controllers should be initialized
     * before performing new project initialization
     * because we need their functionality.
     * ...And Angular can't help us with it.
     */
    var cntrlInitCnt = 0;
    var waitAllInitEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    waitAllInitEvents.on(function(args) {
        if (jQuery.inArray(args.name, ["CNTRL_INIT_STAGES_PANEL",
                "CNTRL_INIT_TOOLBAR", "CNTRL_INIT_SL_BTN",
                "CNTRL_INIT_PROP_WIND", "CNTRL_INIT_COMPILE_BTN"]) !== -1) {
            ++cntrlInitCnt;
        }

        if (cntrlInitCnt === 5) {
            console.log("All controllers are loaded");
            waitAllInitEvents.delete();
            scriptEditorAppInjector.get("ScriptEditorService").newProject();
            console.log("Empty project created");
        }
    });
    //Bootstrap only after event handler was set up 
    var scriptEditorAppInjector =
        angular.bootstrap(document, [scriptEditorApp.name]);
};
