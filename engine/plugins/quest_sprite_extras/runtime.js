﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

cr.behaviors.QuestEngineSpriteExtras = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.QuestEngineSpriteExtras.prototype;
		
	/////////////////////////////////////
	// Behavior type class
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	
	var behtypeProto = behaviorProto.Type.prototype;

	behtypeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Behavior instance class
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	
	var behinstProto = behaviorProto.Instance.prototype;

	behinstProto.onCreate = function()
	{
		// Load properties
		//this.myProperty = this.properties[0];
		
		// object is sealed after this call, so make sure any properties you'll ever need are created, e.g.
		this.animName = "";
	};
	
	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};
	
	// called when saving the full state of the game
	behinstProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your behavior's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	behinstProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	behinstProto.tick = function ()
	{
		//var dt = this.runtime.getDt(this.inst);
		
		// called every tick for you to update this.inst as necessary
		// dt is the amount of time passed since the last tick, in case it's a movement
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	behinstProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": this.type.name,
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				{"name": "My property", "value": this.myProperty}
			]
		});
	};
	
	behinstProto.onDebugValueEdited = function (header, name, value)
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

	Cnds.prototype.HasAnim = function(animName)
	{
		return this.inst.getAnimationByName(animName) !== null;
	};
	
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetAnim = function(animname, from)
	{
		this.animName = animname;
		this.inst.type.plugin.acts.SetAnim.call(this.inst, this.animName, from);
	};
	
	// ... other actions here ...
	
	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	behinstProto.getSpriteAnimByName = function(animName) {
		return this.inst.getAnimationByName(animName);
	}

	behinstProto.getSpriteAnimFrameWidth = function(animName, frameIx)
	{
		var anim = this.getSpriteAnimByName(animName);
		return anim !== null ? anim.frames[frameIx].width : 0;
	};

	Exps.prototype.animFrameWidth = function (ret, animName, frameIx)
	{
		ret.set_float(this.getSpriteAnimFrameWidth(animName, frameIx));
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	behinstProto.getSpriteAnimFrameHeight = function(animName, frameIx)
	{
		var anim = this.getSpriteAnimByName(animName);
		return anim !== null ? anim.frames[frameIx].height : 0;
	};

	Exps.prototype.animFrameHeight = function (ret, animName, frameIx)
	{
		ret.set_float(this.getSpriteAnimFrameHeight(animName, frameIx));
	};

	Exps.prototype.getCurrentAnimName = function(ret)
	{
		ret.set_string(this.animName);
	};

	behinstProto.getCurrentAnimImagePointOffset = function(imagePoint, retX)
	{
		var anim = this.getSpriteAnimByName(this.animName);
		if (anim === null) {
			return 0.0;
		}
		var frame = anim.frames[0];

		var curRealFrame = this.inst.curFrame;
		var curRealX = this.inst.x;
		var curRealY = this.inst.y;
		var curRealWidth = this.inst.width;
		var curRealHeight = this.inst.height;
		var curRealAngle = this.inst.angle;

		this.inst.curFrame = frame;
		this.inst.x = 0.0;
		this.inst.y = 0.0;
		this.inst.width = frame.width;
		this.inst.height = frame.height;
		this.inst.angle = 0.0;

		var result = this.inst.getImagePoint(imagePoint, retX);

		this.inst.curFrame = curRealFrame;
		this.inst.x = curRealX;
		this.inst.y = curRealY;
		this.inst.width = curRealWidth;
		this.inst.height = curRealHeight;
		this.inst.angle = curRealAngle;

		return result;
	}

	Exps.prototype.getCurrentAnimImagePointXOffset = function(ret, imagePoint)
	{
		ret.set_float(this.getCurrentAnimImagePointOffset(imagePoint, true));
	};

	Exps.prototype.getCurrentAnimImagePointYOffset = function(ret, imagePoint)
	{
		ret.set_float(this.getCurrentAnimImagePointOffset(imagePoint, false));
	};

	behaviorProto.exps = new Exps();
	
}());
