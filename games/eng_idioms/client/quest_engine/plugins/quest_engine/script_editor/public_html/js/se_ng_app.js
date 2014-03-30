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
});

scriptEditorApp.run(['ScriptEditorEvents', "ScriptEditor", "TreeCompiler",
    function(seEvents, scriptEditor, treeCompiler) {
        this.seEvents = seEvents;
        this.scriptEditor = scriptEditor;
        this.treeCompiler = treeCompiler;
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

scriptEditorApp.factory("TreeEditor", ["ScriptEditor", TreeEditorFactory]);

scriptEditorApp.controller("ScriptEditorPropertiesWindowController", ['$scope', 'ScriptEditorEvents', '$timeout',
    ScriptEditorPropertiesWindowController]);

scriptEditorApp.controller("ToolbarWindowController", ["$rootScope", '$scope', 'ScriptEditorEvents', '$timeout',
    ToolbarWindowController]);

scriptEditorApp.controller("CompileBtnController", ['$scope', 'ScriptEditorEvents', CompileBtnController]);

scriptEditorApp.factory("TreeCompiler", ["$rootScope", "TreeEditor", "ScriptEditorEvents",
    TreeCompilerFactory]);

    this.staticConstructorsCnt = 7;
    var constrComplCB = this.onStaticConstrCompleted.bind(this);
    ScriptEditorStaticConstructor(constrComplCB);
    ScriptTreeEditorStaticConstructor(constrComplCB);
    SENodeStaticConstructor(constrComplCB);
    SECondStaticConstructor(constrComplCB);
    ToolBarItemStaticConstructor(constrComplCB);
    ToolbarStaticConstructor(constrComplCB);
    SEInputManagerStaticConstructor(constrComplCB);
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
