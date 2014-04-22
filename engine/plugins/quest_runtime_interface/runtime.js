// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.QuestRuntimeInterfacePlugin = function(runtime)
{
	this.runtime = runtime;
};

function StageAction() {
	//Const
	this.stageName = "";
	//INs
	this.lastPlayerAction = "";
	this.lastActionTargetId = "";

	this.clearOutFields = function() {
		//OUTs
		this.actor = "";
		this.action = "";
		this.npcActorUID = 0;

		this.animationName = "";

		this.text = "";
		this.answer1Text = "";
		this.answer2Text = "";
		this.answer3Text = "";
		this.answer4Text = "";
		this.phraseType = "";

		this.delay = 0;
		this.continue = 0;
	};
	this.clearOutFields();
}

(function ()
{
	var pluginProto = cr.plugins_.QuestRuntimeInterfacePlugin.prototype;
		
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
		// e.g...
		// this.myValue = 0;
		this.StageAction = StageAction;
		this.curStageName = null;
		this.stageActions = {}; //stage name -> Stage
	};

	instanceProto.curStageAction = function() {
		return this.stageActions[this.curStageName];
	}
	
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

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	/*Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};*/
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.setStage = function(value) {
		this.curStageName = value;
	};

	Acts.prototype.setLastPlayerAction = function(value) {
		this.curStageAction().lastPlayerAction = value;
	};

	Acts.prototype.setLastActionTargetId = function(value) {
		this.curStageAction().lastActionTargetId = value;
	};

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	//this is instance in expressions
	Exps.prototype.getCurrentStage = function(ret)
	{
		ret.set_string(this.curStageName);	
	}

	Exps.prototype.getActor = function(ret)
	{
		ret.set_string(this.curStageAction().actor);
	};

	Exps.prototype.getNPCActorUID = function(ret) {
		ret.set_int(this.curStageAction().npcActorUID);
	};

	Exps.prototype.getAction = function(ret) {
		ret.set_string(this.curStageAction().action);
	};

	Exps.prototype.getAnimationName = function(ret) {
		ret.set_string(this.curStageAction().animationName);
	};

	Exps.prototype.getText = function(ret) {
		ret.set_string(this.curStageAction().text);
	};

	Exps.prototype.getAnswer1Text = function(ret) {
		ret.set_string(this.curStageAction().answer1Text);
	};

	Exps.prototype.getAnswer2Text = function(ret) {
		ret.set_string(this.curStageAction().answer2Text);
	};

	Exps.prototype.getAnswer3Text = function(ret) {
		ret.set_string(this.curStageAction().answer3Text);
	};

	Exps.prototype.getAnswer4Text = function(ret) {
		ret.set_string(this.curStageAction().answer4Text);
	};

	Exps.prototype.getPhraseType = function(ret) {
		ret.set_string(this.curStageAction().phraseType);
	};

	Exps.prototype.getDelay = function(ret) {
		ret.set_int(this.curStageAction().delay);
	};

	Exps.prototype.getContinue = function(ret) {
		ret.set_int(this.curStageAction().continue);
	};

	pluginProto.exps = new Exps();

}());
