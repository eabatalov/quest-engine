// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.QuestLevelRuntimePlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.QuestLevelRuntimePlugin.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
        this.levelRuntime = null;
        this.uiActionManager = null;
        QuestGame.instance.events.levelChanged.subscribe(this, this.onLevelChanged);
   	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

    instanceProto.onLevelChanged = function(questLevel) {
		this.levelRuntime = new QuestLevelRuntime(questLevel);
		this.uiActionManager = new UIStageActionManager();
        this.runtime.trigger(pluginProto.cnds.levelChanged, this);
    };

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.levelChanged = function() {
	    return true; //cf_trigger was signaled explicitly
    };
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

    //=== SETUP ===
	Acts.prototype.setupQuestObjects = function(npcType) {
        this.levelRuntime.setupObjects(npcType);
    };

	Acts.prototype.setupQuestScript = function(scriptURL) {
	    this.levelRuntime.setupScript(scriptURL);
    };

    //=== Level ===
   	Acts.prototype.startLevel = function(levelName) {
        QuestGame.instance.setCurrentLevelByName(levelName);
    };

    Acts.prototype.setStage = function(stageName) {
        this.uiActionManager.setCurrentStageName(stageName);
	};

    //=== Level action in ===
	Acts.prototype.playerActionExec = function() {
	    this.levelRuntime.playerActionExec(
            this.uiActionManager.getCurrentStageUIActionIN(),
            this.uiActionManager.getCurrentStageUIActionOUT()
        );
    };

    Acts.prototype.setLastPlayerAction = function(value) {
        this.uiActionManager.getCurrentStageUIActionIN().setActionType(value);
	};

	Acts.prototype.setLastActionTargetId = function(value) {
        this.uiActionManager.getCurrentStageUIActionIN().setTargetId(value);
	};

    Acts.prototype.setLastActionName = function(value) {
        this.uiActionManager.getCurrentStageUIActionIN().setName(value);
	};

    pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	//=== Level action out ===
    //this is instance in expressions
	Exps.prototype.getCurrentStage = function(ret)
	{
		ret.set_string(
            this.uiActionManager.getCurrentStageName()
        );
	}

	Exps.prototype.getActor = function(ret)
	{
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getActorType()
        );
	};

	Exps.prototype.getNPCActorUID = function(ret) {
		ret.set_int(
            this.uiActionManager.getCurrentStageUIActionOUT().getNPCActorUID()
        );
	};

	Exps.prototype.getAction = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getActionType()
        );
	};

	Exps.prototype.getAnimationName = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getAnimationName()
        );
	};

	Exps.prototype.getText = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getText()
        );
	};

	Exps.prototype.getAnswer1Text = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getAnswer1Text()
        );
	};

	Exps.prototype.getAnswer2Text = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getAnswer2Text()
        );
	};

	Exps.prototype.getAnswer3Text = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getAnswer3Text()
        );
	};

	Exps.prototype.getAnswer4Text = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getAnswer4Text()
        );
	};

	Exps.prototype.getPhraseType = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getPhraseType()
        );
	};

	Exps.prototype.getDelay = function(ret) {
		ret.set_int(
            this.uiActionManager.getCurrentStageUIActionOUT().getDelaySec()
        );
	};

	Exps.prototype.getContinue = function(ret) {
		ret.set_int(
            this.uiActionManager.getCurrentStageUIActionOUT().getIsContinue()
        );
	};

    Exps.prototype.getFuncName = function(ret) {
		ret.set_string(
            this.uiActionManager.getCurrentStageUIActionOUT().getFuncName()
        );
	};

    Exps.prototype.getEnabled = function(ret) {
		ret.set_int(
            this.uiActionManager.getCurrentStageUIActionOUT().getEnabled()
        );
	};

    Exps.prototype.getHasNext = function(ret) {
		ret.set_int(
            this.uiActionManager.getCurrentStageUIActionOUT().getHasNext()
        );
	};

	pluginProto.exps = new Exps();

}());
