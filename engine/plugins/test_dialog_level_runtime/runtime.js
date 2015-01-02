// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.TestDialogLevelRuntimePlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.TestDialogLevelRuntimePlugin.prototype;
		
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
        this.controller = null;
        this.controllerHandlers = [];
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

    instanceProto.onQuestionAnswered = function(isAnswerRight) {
        var cnd = isAnswerRight ?
            pluginProto.cnds.onQuestionAnsweredRight :
            pluginProto.cnds.onQuestionAnsweredWrong;
        this.runtime.trigger(cnd, this);
    };

    instanceProto.onQuestionIsAvaliable = function() {
        this.runtime.trigger(pluginProto.cnds.onQuestionIsAvaliable, this);
    };

    instanceProto.onTestCompleted = function() {
        this.runtime.trigger(pluginProto.cnds.onDialogIsFinished, this);
    };

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

    Cnds.prototype.onQuestionAnsweredRight = function() {
        return true;
    };

    Cnds.prototype.onQuestionAnsweredWrong = function() {
        return true;
    };

    Cnds.prototype.onQuestionIsAvaliable = function() {
        return true;
    };

    Cnds.prototype.onDialogIsFinished = function() {
        return true;
    };

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.runTestDialog = function(dialogName, mode) {
        jQuery.each(this.controllerHandlers, collectionObjectDelete);
        var controllerClassName = this.properties[0];
        eval("new " + controllerClassName
            + "("
            + "'" + dialogName + "',"
            + (mode === 1 ? true : false).toString()
            + ", onControllerReady.bind(this)"
            + ");");
        function onControllerReady(controller) {
            this.controller = controller;
            this.controllerHandlers = [
                this.controller.events.onQuestionAnswered.
                    subscribe(this, this.onQuestionAnswered),
                this.controller.events.onQuestionIsAvaliable.
                    subscribe(this, this.onQuestionIsAvaliable),
                this.controller.events.onTestCompleted.
                    subscribe(this, this.onTestCompleted)
            ];
            this.controller.waitNextQuestion();
        }
    };

    Acts.prototype.answerQuestion = function(answer) {
        this.controller.answerCurrentQuestion(answer);
        this.controller.waitNextQuestion();
    };

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

    Exps.prototype.getQuestionText = function(ret) {
        ret.set_string(this.controller.getCurrentQuestionText());
    };

    Exps.prototype.getQuestionPolyProp = function(ret, propName) {
        ret.set_string(this.controller.getCurrentQuestionPolyProp(propName));
    };

    Exps.prototype.getQuestionSectionPolyProp = function(ret, propName) {
        ret.set_string(this.controller.getCurrentQuestionSectionPolyProp(propName));
    };

    Exps.prototype.getScriptPolyProp = function(ret, propName) {
        ret.set_string(this.controller.getScriptPolyProp(propName));
    };

    Exps.prototype.getQuestionsCount = function(ret) {
        ret.set_int(this.controller.getQuestionsCount());
    };

    Exps.prototype.getRightAnswersCount = function(ret) {
        ret.set_int(this.controller.getRightAnswersCount());
    };

    Exps.prototype.getAnswersCount = function(ret) {
        ret.set_int(this.controller.getAnswersCount());
    };

    pluginProto.exps = new Exps();
}());
