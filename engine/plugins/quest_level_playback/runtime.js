// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.QuestLevelPlaybackPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.QuestLevelPlaybackPlugin.prototype;
		
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
        this.levelReplayPlayerController = null;
        this.levelSpecificHandlers = [];
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

    instanceProto.onLevelChanged = function(questLevelRuntime) {
        jQuery.each(this.levelSpecificHandlers, collectionObjectDelete);
        this.levelSpecificHandlers = [];

        if (this.levelReplayPlayerController)
            this.levelReplayPlayerController.delete();

        var questLevelReplayPlayer =
            new QuestLevelReplayPlayer(questLevelRuntime.getLevelExecutor());
        this.levelReplayPlayerController = new QuestLevelReplayPlayerController(
            questLevelRuntime.getLevel(),
            questLevelReplayPlayer,
            QuestGame.instance.getLevelReplayLoader()
        );
        this.levelSpecificHandlers.push(this.levelReplayPlayerController.events.
            recPending.subscribe(this, this.onRecPending));
        this.levelSpecificHandlers.push(this.levelReplayPlayerController.events.
            levelReplayLoaded.subscribe(this, this.onLevelGameplayHistoryLoaded));
    };

    instanceProto.onRecPending = function(rec) {
        switch (rec.getRecordType()) {
            case PlayerPositionRecord.type:
                this.runtime.trigger(pluginProto.cnds.playerPosChange, this);
            break;
            default:
                console.error("Unknown record to play");
        }
    };

    instanceProto.onLevelGameplayHistoryLoaded = function() {
        this.runtime.trigger(pluginProto.cnds.levelGameplayHistoryLoaded, this);
    };
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

    Cnds.prototype.playerPosChange = function() {
        return true;
    };

    Cnds.prototype.levelGameplayHistoryLoaded = function() {
        return true;
    };

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.play = function() {
        this.levelReplayPlayerController.play();
    };

    Acts.prototype.stop = function() {
        this.levelReplayPlayerController.stop();
    };

    Acts.prototype.playerPosChangeProcCompleted = function() {
        assert(
            this.levelReplayPlayerController.getPendingRecord().getRecordType()
            === PlayerPositionRecord.type, "only pos change record can be completed here"
        );
        this.levelReplayPlayerController.recProcCompleted();
    };

	Acts.prototype.speedUp = function() {
        this.levelReplayPlayerController.speedUp();
    };

    Acts.prototype.speedDown = function() {
        this.levelReplayPlayerController.speedDown();
    };

    Acts.prototype.load = function() {
        this.levelReplayPlayerController.load();
    };

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

    Exps.prototype.getPlayerX = function(ret) {
        assert(
            this.levelReplayPlayerController.getPendingRecord().getRecordType()
            === PlayerPositionRecord.type, "only pos change record provides player X"
        );
        ret.set_int(this.levelReplayPlayerController.getPendingRecord().getPlayerX());
    };

    Exps.prototype.getPlayerY = function(ret) {
        assert(
            this.levelReplayPlayerController.getPendingRecord().getRecordType()
            === PlayerPositionRecord.type, "only pos change record provides player X"
        );
        ret.set_int(this.levelReplayPlayerController.getPendingRecord().getPlayerY());
    };

    Exps.prototype.getPlaybackPosMin = function(ret) {
        ret.set_int(this.levelReplayPlayerController.getPlaybackPosMin());
    };

    Exps.prototype.getPlaybackPosSec = function(ret) {
        ret.set_int(this.levelReplayPlayerController.getPlaybackPosSec());
    };

    Exps.prototype.getPlaybackSpeed = function(ret) {
        ret.set_string(this.levelReplayPlayerController.getPlaybackSpeed());
    };
    pluginProto.exps = new Exps();
}());
