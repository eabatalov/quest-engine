﻿function GetPluginSettings()
{
	return {
		"name":			"Quest level playback",// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"QuestLevelPlaybackPlugin",		// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Interface to quest level playback fascilities",
		"author":		"Eugene/Learzing",
		"help url":		"Learzing.com",
		"category":		"Learzing",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				        // either "world" (appears in layout and is drawn), else ""
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
        , "dependency": ""
	};
};

AddCondition(0, cf_trigger, "Change player position", "General",
    "Change player position", "Change player position", "playerPosChange");
AddCondition(1, cf_trigger, "Level gameplay history loaded", "General",
    "Level gameplay history loaded", "Level gameplay history loaded", "levelGameplayHistoryLoaded");


AddAction(0, af_none, "Play", "General", "Play", "Play", "play");
AddAction(1, af_none, "Stop", "General", "Stop", "Stop", "stop");
AddAction(2, af_none, "Signal player position change completed", "General",
    "Signal player position change completed",
    "Signal player position change completed",
    "playerPosChangeProcCompleted");
AddAction(3, af_none, "Speed up", "General", "Speed up", "Speed up", "speedUp");
AddAction(4, af_none, "Speed down", "General", "Speed down", "Speed down", "speedDown");
AddAction(5, af_none, "Load", "General", "Load", "Load", "load");

AddExpression(0, ef_return_number, "Player position X", "Player position X", "getPlayerX",
    "Player position X");
AddExpression(1, ef_return_number, "Player position Y", "Player position Y", "getPlayerY",
    "Player position Y");

ACESDone();

var property_list = [];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}
