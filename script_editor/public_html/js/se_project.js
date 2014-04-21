function SEProjectSaveService(seService, seEventRouter) {
    this.seService = seService;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.seEvents.on(function(msg) {
        if (msg.name === "PROJECT_SAVE")
            this.run();
    }, this);
};

SEProjectSaveService.prototype.run = function() {
    var projectSaved = {
        script : this.seService.script.save(),
        scriptEditor : this.seService.scriptEditor.save()
    };
    projectSavedJSON = JSON.stringify(projectSaved, null, '\t');
    var scriptAsBlob = new Blob([projectSavedJSON], { type : 'application/json' });
    saveAs(scriptAsBlob, this.seService.script.getName() + ".json");
};

function SEProjectOpenService(seService, seEventRouter) {
    this.seService = seService;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.seEvents.on(function(msg) {
        if (msg.name === "PROJECT_FILE_OPEN")
            this.run(msg.json);
    }, this);
};

SEProjectOpenService.prototype.run = function(projectSavedJSON) {
    var projectSaved = JSON.parse(projectSavedJSON);
    this.seService.scriptEditor.delete();
    this.seService.script.delete();
    this.seService.script = SEScript.load(projectSaved.script);
    this.seService.scriptEditor = ScriptEditor.load(
        this.seService.script,
        this.seService.seEventRouter,
        this.seService.mouseWheelManager,
        projectSaved.scriptEditor
    );
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PROJECT_FILE_OPENED" });
};

//Temporal save/load testing method. Used until we have our unit tests.
function testSaveLoad() {
    var scriptSavedJSON = JSON.stringify(this.script.save(), null, '\t');
    var scriptEditorSavedJSON = JSON.stringify(this.scriptEditor.save(), null, '\t');
    this.scriptEditor.delete();
    this.script.delete();
    this.script = SEScript.load(JSON.parse(scriptSavedJSON));
    this.scriptEditor = ScriptEditor.load(
        this.script,
        this.seEventRouter,
        this.mouseWheelManager,
        JSON.parse(scriptEditorSavedJSON)
    );
    var scriptEditorSavedJSONAfterLoad = JSON.stringify(this.scriptEditor.save(), null, '\t');
    var scriptSavedJSONAfterLoad = JSON.stringify(this.script.save(), null, '\t');

    if (scriptEditorSavedJSON !== scriptEditorSavedJSONAfterLoad) {
        console.error("scriptEditorSavedJSON !== scriptEditorSavedJSONAfterLoad");
        console.log("Before \n" + scriptEditorSavedJSON);
        console.log("After: \n" + scriptEditorSavedJSONAfterLoad);
    }

    if (scriptSavedJSON !== scriptSavedJSONAfterLoad) {
        console.error(scriptSavedJSON !== scriptSavedJSONAfterLoad);
        console.log("Before \n" + scriptSavedJSON);
        console.log("After \n" + scriptSavedJSONAfterLoad);
    }
};
