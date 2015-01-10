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
        this.levelExecutionController = null;
        this.levelSpecificEventHandlers = [];
        QuestGame.instance.events.levelChangedAfter.subscribe(this, this.onLevelChanged);
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

    instanceProto.onLevelChanged = function(questLevelRuntime) {
        jQuery.each(this.levelSpecificEventHandlers, collectionObjectDelete);
        this.levelSpecificEventHandlers = [];

		this.levelExecutionController =
            new LevelExecutorController(questLevelRuntime.getLevelExecutor());
        this.levelSpecificEventHandlers.push(
            this.levelExecutionController.events.
                uiActionPending.subscribe(this, this.onUIActionPending.bind(this))
        );

        this.runtime.trigger(pluginProto.cnds.levelChanged, this);
    };

    instanceProto.onUIActionPending = function(uiOutAction) {
        switch (uiOutAction.getActionType()) {
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.CMD_SEQUENCE_STARTED:
                this.runtime.trigger(pluginProto.cnds.onUICmdSequenceStarted, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.CMD_SEQUENCE_FINISHED:
                this.runtime.trigger(pluginProto.cnds.onUICmdSequenceFinished, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE:
                this.runtime.trigger(pluginProto.cnds.onUICmdPhrase, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ:
                this.runtime.trigger(pluginProto.cnds.onUICmdQuizz, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.ANIMATION:
                this.runtime.trigger(pluginProto.cnds.onUICmdAnimation, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR:
                this.runtime.trigger(pluginProto.cnds.onUICmdStageClear, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.FUNC_CALL:
                this.runtime.trigger(pluginProto.cnds.onUICmdFuncCall, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.NOTIFICATION:
                this.runtime.trigger(pluginProto.cnds.onUICmdNotification, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.PLAYER_MOVEMENT:
                this.runtime.trigger(pluginProto.cnds.onUICmdPlayerMovement, this);
            break;
            case _UI_STAGE_ACTION_OUT.ACTION_TYPES.NO_UI_ACTION_REQUIRED:
                this.runtime.trigger(pluginProto.cnds.onNoUIActionRequired, this);
            break;
        }
    };

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.levelChanged = function() {
	    return true; //cf_trigger was signaled explicitly
    };

    Cnds.prototype.onUICmdSequenceStarted = function() {
        return true;
    };

    Cnds.prototype.onUICmdSequenceFinished = function() {
        return true;
    };

    Cnds.prototype.onUICmdStageClear = function() {
        return true;
    };

    Cnds.prototype.onUICmdFuncCall = function() {
        return true;
    };

    Cnds.prototype.onUICmdNotification = function() {
        return true;
    };

    Cnds.prototype.onUICmdPlayerMovement = function() {
        return true;
    };

    Cnds.prototype.onUICmdPhrase = function() {
        return true;
    };

    Cnds.prototype.onUICmdQuizz = function() {
        return true;
    };

    Cnds.prototype.onUICmdAnimation = function() {
        return true;
    };

    Cnds.prototype.onNoUIActionRequired = function() {
        return true;
    };

	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

    //=== SETUP ===
	Acts.prototype.setupQuestObjects = function(npcType) {
        this.levelExecutionController.setupObjects(npcType);
    };

    //=== Level ===
   	Acts.prototype.startLevel = function(levelName) {
        QuestGame.instance.setCurrentLevelByName(levelName);
    };

    //=== UI action out ===
    Acts.prototype.UICmdCompleted = function() {
        this.levelExecutionController.currentUIActionProcCompleted();
    };

    //=== UI action in ===
	Acts.prototype.playerActionExec = function() {
	    this.levelExecutionController.uiActionInExec();
    };

    Acts.prototype.setStage = function(stageName) {
        this.levelExecutionController.getUIActionIn().setStageName(stageName);
	};

    Acts.prototype.setLastPlayerAction = function(value) {
        this.levelExecutionController.getUIActionIn().setActionType(value);
	};

	Acts.prototype.setLastActionTargetId = function(value) {
        this.levelExecutionController.getUIActionIn().setTargetId(value);
	};

    Acts.prototype.setLastActionName = function(value) {
        this.levelExecutionController.getUIActionIn().setName(value);
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
            this.levelExecutionController.getUIActionOut().getStageName()
        );
	}

	Exps.prototype.getActor = function(ret)
	{
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getActorType()
        );
	};

	Exps.prototype.getNPCActorUID = function(ret) {
		ret.set_int(
            this.levelExecutionController.getUIActionOut().getNPCActorUID()
        );
	};

	Exps.prototype.getAnimationName = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getAnimationName()
        );
	};

	Exps.prototype.getText = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getText()
        );
	};

	Exps.prototype.getAnswer1Text = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getAnswer1Text()
        );
	};

	Exps.prototype.getAnswer2Text = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getAnswer2Text()
        );
	};

	Exps.prototype.getAnswer3Text = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getAnswer3Text()
        );
	};

	Exps.prototype.getAnswer4Text = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getAnswer4Text()
        );
	};

	Exps.prototype.getPhraseType = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getPhraseType()
        );
	};

	Exps.prototype.getPhraseSize = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getPhraseSize()
        );
	};

	Exps.prototype.getDuration = function(ret) {
		ret.set_int(
            this.levelExecutionController.getUIActionOut().getDurationSec()
        );
	};

    Exps.prototype.getFuncName = function(ret) {
		ret.set_string(
            this.levelExecutionController.getUIActionOut().getFuncName()
        );
	};

    Exps.prototype.getEnabled = function(ret) {
		ret.set_int(
            this.levelExecutionController.getUIActionOut().getEnabled()
        );
	};

    Exps.prototype.getHasNext = function(ret) {
		ret.set_int(
            this.levelExecutionController.getUIActionOut().getHasNext()
        );
	};

    Exps.prototype.getHasBack = function(ret) {
		ret.set_int(
            this.levelExecutionController.getUIActionOut().getCanReverse()
        );
	};

    Exps.prototype.getAllowAnimated = function(ret) {
        ret.set_int(
            this.levelExecutionController.getUIActionOut().getAllowAnimated()
        );
    };

    Exps.prototype.getClearStage = function(ret) {
        ret.set_int(
            this.levelExecutionController.getUIActionOut().getClearStage()
        );
    };

    Exps.prototype.getParamByName = function(ret, pName) {
        var param = this.levelExecutionController.
            getUIActionOut().getParamByName(pName);
        switch(param.type) {
            case SEFuncCallNodeParameter.types.str:
                ret.set_string(param.value);
            break;
            case SEFuncCallNodeParameter.types.num:
                ret.set_int(param.value);
            break;
        };
    };

	pluginProto.exps = new Exps();

}());
