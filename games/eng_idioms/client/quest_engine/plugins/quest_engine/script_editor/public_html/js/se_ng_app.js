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

scriptEditorApp.run(['$rootScope', 'ScriptEditorEvents',
    function($rootScope, seEvents) {
        $rootScope.scriptEditor = new ScriptEditor();
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

scriptEditorApp.factory('ScriptEditorEvents',
    function($rootScope) {
        var events = {};

        events.args = {
            name : "",
            obj : null
        };

        events.broadcast = function(args) {
            this.args = args;
            $rootScope.$broadcast('seEvent');
        };

        return events;
    });

/* Execution time dependent bootstrap code */
function ScriptEditorBootstrap() {
    this.staticConstructorsCnt = 6;
    var constrComplCB = this.onStaticConstrCompleted.bind(this);
    ScriptEditorStaticConstructor(constrComplCB);
    ScriptTreeEditorStaticConstructor(constrComplCB);
    SENodeStaticConstructor(constrComplCB);
    SECondStaticConstructor(constrComplCB);
    ToolBarItemStaticConstructor(constrComplCB);
    ToolbarStaticConstructor(constrComplCB);
}

seBootstrap = null;
$(document).ready(function() {
    seBootstrap = new ScriptEditorBootstrap();
});

ScriptEditorBootstrap.prototype.onStaticConstrCompleted = function() {
    this.staticConstructorsCnt -= 1;
    if (this.staticConstructorsCnt > 0)
        return;

    scriptEditorApp.controller(ScriptEditorPropertiesWindowControllerAppDecl[0],
        ScriptEditorPropertiesWindowControllerAppDecl[1]);

    angular.bootstrap(document.body, [scriptEditorApp.name]);
};