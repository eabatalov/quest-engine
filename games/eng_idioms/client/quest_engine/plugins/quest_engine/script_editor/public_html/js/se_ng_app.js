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

scriptEditorApp.run(['ScriptEditorEvents', "ScriptEditor",
    function(seEvents, scriptEditor, treeCompiler) {
        this.seEvents = seEvents;
        this.scriptEditor = scriptEditor;
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

scriptEditorApp.factory('ScriptEditorEvents', ['$rootScope',
    function($rootScope) {
        var events = {};

        events.broadcast = function(args) {
            $rootScope.$broadcast('seEvent', args);
        };

        events.on = function(cb) {
            $rootScope.$on('seEvent', function(ev, args) { cb(args); });
        };

        return events;
    }
]);

scriptEditorApp.factory("MouseWheelManager", [MouseWheelManagerFactory]);

scriptEditorApp.factory("ScriptEditor", ["$rootScope", "ScriptEditorEvents", "MouseWheelManager", ScriptEditorFactory]);

scriptEditorApp.controller("ScriptEditorPropertiesWindowController", ['$scope', 'ScriptEditorEvents', '$timeout',
    ScriptEditorPropertiesWindowController]);

scriptEditorApp.controller("ToolbarWindowController", ["$rootScope", '$scope', 'ScriptEditorEvents', '$timeout',
    ToolbarWindowController]);

scriptEditorApp.controller("CompileBtnController", ['$scope', 'ScriptEditorEvents', CompileBtnController]);

scriptEditorApp.controller("StagesPanelController", ['$scope', 'ScriptEditorEvents', StagesPanelController]);

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
