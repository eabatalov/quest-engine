/* Execution time dependent bootstrap code */
function ScriptEditorBootstrap() {

    this.scriptEditorApp = null;
    this.seEventRouter = new SEEventRouter();

    /*
     * ScriptEditor app bootstrap code.
     * Performs all the sync/async initialization first and then
     * starts the app.
     */
    /* Execution time independent bootstrap code */
    this.scriptEditorApp = angular.module('ScriptEditorApp', []);

    this.scriptEditorApp.config(function() {
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

    this.scriptEditorApp.filter('hasFieldValue', function() {
        return function(value) {
            if (value !== null && value !== undefined) {
                return true;
            } else return false;
        };
    });

    this.scriptEditorApp.filter('hasField', function() {
        return function(value) {
            return value !== undefined;
        };
    });

    this.scriptEditorApp.value('SEEventRouter', this.seEventRouter);

    this.scriptEditorApp.factory("MouseWheelManager", [MouseWheelManagerFactory]);

    this.scriptEditorApp.factory("KeyboardManager", ["SEEventRouter", KeyboardManagerFactory]);

    this.scriptEditorApp.factory("Clipboard", ["SEEventRouter", ClipboardFactory]);

    this.scriptEditorApp.factory("SEUserInteractionManager", ["SEEventRouter", SEUserInteractionManagerFactory]);

    this.scriptEditorApp.controller("ScriptEditorPropertiesWindowController", 
            ['$scope', 'SEEventRouter', 'ScriptEditorService', '$timeout',
            ScriptEditorPropertiesWindowController]);

    this.scriptEditorApp.controller("ToolbarWindowController", ['$scope', 'SEEventRouter', '$timeout',
            ToolbarWindowController]);

    this.scriptEditorApp.controller("CompileBtnController", ['$scope', 'SEEventRouter', CompileBtnController]);

    this.scriptEditorApp.controller("StagesPanelController", ['$scope', 'SEEventRouter', 'ScriptEditorService', '$timeout',
            StagesPanelController]);

    this.scriptEditorApp.controller("SaveLoadController", ['$scope', 'SEEventRouter', SaveLoadController]);

    this.scriptEditorApp.controller("ScriptPropsController", ['$scope', 'SEEventRouter', 'ScriptEditorService', '$timeout',
            ScriptPropsController]);

    this.scriptEditorApp.factory("ScriptEditorService", [
            "SEEventRouter",
            "MouseWheelManager",
            "SEUserInteractionManager",
            "KeyboardManager",
            "Clipboard",
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

var seBootstrap = null;
$(document).ready(function() {
    seBootstrap = new ScriptEditorBootstrap();
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
    var ALL_INIT_EVENTS = ["CNTRL_INIT_STAGES_PANEL",
        "CNTRL_INIT_TOOLBAR", "CNTRL_INIT_SL_BTN",
        "CNTRL_INIT_PROP_WIND", "CNTRL_INIT_COMPILE_BTN",
        "CNTRL_INIT_SCPROPS_WIND"];
    var cntrlInitCnt = ALL_INIT_EVENTS.length;
    var waitAllInitEvents = this.seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    waitAllInitEvents.on(function(args) {
        if (jQuery.inArray(args.name, ALL_INIT_EVENTS) !== -1) {
            --cntrlInitCnt;
        }

        if (cntrlInitCnt === 0) {
            console.log("All controllers are loaded");
            waitAllInitEvents.delete();

            this.scriptEditorService =
                angular.element(document).injector().get("ScriptEditorService");
            this.scriptEditorService.newProject();
            console.log("Empty project created");
        }
    });

    //Bootstrap only after init events handler was set up 
    this.scriptEditorAppInjector =
        angular.bootstrap(document, [this.scriptEditorApp.name]);
};
