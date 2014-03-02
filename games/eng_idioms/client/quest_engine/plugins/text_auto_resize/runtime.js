// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.TextAutoResize = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var behaviorProto = cr.behaviors.TextAutoResize.prototype;
		
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
		this.running = false;
	};

	behinstProto.onDestroy = function ()
	{
		// called when associated object is being destroyed
		// note runtime may keep the object and behavior alive after this call for recycling;
		// release, recycle or reset any references here as necessary
	};

	behinstProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": this.type.name,
			"properties": []
		});
	};

	behinstProto.tick = function () {};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	Cnds.prototype.NewTextRedrawn = function ()
	{
		return true; //cf_trigger was signaled explicitly
	};
	behaviorProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetTextAndAutoResize = function (text)
	{
		/*
			set text using action as usually
			and set text inst size after first redraw.
			this.inst should be visible on the layout
			to be redrawn.
		*/
		var thiz = this;
		thiz.inst.type.plugin.acts.SetText.call(thiz.inst, text);

		if (thiz.running)
			return;

		thiz.running = true;

		var origDraw = thiz.inst.draw;
		var origX = thiz.inst.x;
		var origY = thiz.inst.y;
		var origVisible = thiz.inst.visible;
		var origOpacity = thiz.inst.opacity;

		var ourX = thiz.inst.layer.canvasToLayer(0, 0, true, true);
		var ourY = thiz.inst.layer.canvasToLayer(0, 0, false, true);
		var ourVisible = true;
		var ourOpacity = 0;
		var ourDraw = function(ctx, glmode)
		{
			//Could be changed between call to SetTextAndAutoResize and draw
			var origX = thiz.inst.x === origX ? origX : thiz.inst.x;
			var origY = thiz.inst.y === origY ? origY : thiz.inst.y;
			var origVisible = thiz.inst.visible === origVisible ? origVisible : thiz.inst.visible;
			var origOpacity = thiz.inst.opacity === origOpacity ? origOpacity : thiz.inst.opacity;

			thiz.inst.draw = origDraw;
			thiz.inst.x = ourX;
			thiz.inst.y = ourY;
			thiz.inst.opacity = ourOpacity;
			thiz.inst.visible = ourVisible;

			//First call draw to compute text height
			thiz.inst.draw(ctx, glmode);
			var textHeight = 0;
			thiz.inst.type.plugin.exps.TextHeight.call(thiz.inst, {
				set_int : function(val) {
					textHeight = val;
				}
			});
			thiz.inst.height = textHeight == 0 ? 0 : textHeight + 1;
			//Set real values back
			thiz.inst.x = origX;
			thiz.inst.y = origY;
			thiz.inst.visible = origVisible;
			thiz.inst.opacity = origOpacity;
			//Height of this text object is changed so external code needs
			//to handle this event before we redraw this text object
			//otherwise user will see quick blinks
			//thiz.inst.draw(ctx, glmode);
			thiz.running = false;
			//Notify
			thiz.runtime.trigger(cr.behaviors.TextAutoResize.prototype.cnds.NewTextRedrawn, thiz.inst);
		};

		//Make object visible and draw it. Our overriden "draw" should be called to measure text size
		thiz.inst.x = ourX;
		thiz.inst.y = ourY;
		thiz.inst.visible = ourVisible;
		thiz.inst.draw = ourDraw;
		//This call makes our function completely synchronous
		//But we disable because setting up few texts in a raw results in recognizable UI delay
		//If you want this function to be synchronous just call CompleteAll action
		//thiz.runtime.draw();
	};

	Acts.prototype.CompleteAll = function (text)
	{
		this.runtime.draw();
	}

	behaviorProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	behaviorProto.exps = new Exps();
}());