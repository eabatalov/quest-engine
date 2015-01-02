function GetPluginSettings()
{
	return {
		"name":			"Test dialog level runtime",// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"TestDialogLevelRuntimePlugin",		// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Interface to test dialog level fascilities",
		"author":		"Eugene/Learzing",
		"help url":		"Learzing.com",
		"category":		"Learzing",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				        // either "world" (appears in layout and is drawn), else ""
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		0						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
						| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
        , "dependency": ""
	};
};

AddCondition(0, cf_trigger, "Question is avaliable", "General",
    "Question is avaliable", "Question is avaliable", "onQuestionIsAvaliable");
AddCondition(1, cf_trigger, "Dialog is finished", "General",
    "Dialog is finished", "Dialog is finished", "onDialogIsFinished");
AddCondition(2, cf_trigger, "Question answered right", "General",
    "Question answered right", "Question answered right", "onQuestionAnsweredRight");
AddCondition(3, cf_trigger, "Question answered wrong", "General",
    "Question answered wrong", "Question answered wrong", "onQuestionAnsweredWrong");

AddStringParam("Dialog name", "Dialog name", "");
AddComboParamOption("Normal");
AddComboParamOption("Debug");
AddComboParam("Mode", "Test or debug mode.")
AddAction(0, af_none, "Run test dialog", "General", "Run test dialog {0} in {1} mode",
    "Run test dialog", "runTestDialog");

AddStringParam("Answer 'TRUE' | 'FALSE'", "Answer", "");
AddAction(1, af_none, "Answer current question", "General", "Answer current question {0}",
    "Answer current question", "answerQuestion");

AddExpression(1, ef_return_string, "Get question text", "Get question text",
    "getQuestionText", "Get question text");

AddStringParam("name", "The name of property.");
AddExpression(6, ef_return_string, "Get question polymorphic property",
    "Get question polymorphic property",
    "getQuestionPolyProp", "Get question polymorphic property");

AddStringParam("name", "The name of property.");
AddExpression(7, ef_return_string, "Get question section polymorphic property",
    "Get question section polymorphic property",
    "getQuestionSectionPolyProp", "Get question section polymorphic property");

AddStringParam("name", "The name of property.");
AddExpression(8, ef_return_string, "Get script polymorphic property",
    "Get script polymorphic property",
    "getScriptPolyProp", "Get script polymorphic property");

AddExpression(3, ef_return_number, "Get questions count", "Get question count",
    "getQuestionsCount", "Get questions count");

AddExpression(4, ef_return_number, "Get answers count", "Get answers count",
    "getAnswersCount", "Get answers count");

AddExpression(5, ef_return_number, "Get right answers count",
    "Get right answers count", "getRightAnswersCount",
    "Get right answers count");

ACESDone();

var property_list = [
    new cr.Property(ept_text, "RuntimeContollerClassName", "TestDialogRuntimeController",
        "Polymorphic controller to create for test dialog")
];

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
{}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
	//renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();
	renderer.Fill(quad, cr.RGB(230,235,245));
	var blue=cr.RGB(32,111,203);
	var violet=cr.RGB(152,100,248);
	renderer.Line(new cr.vector2(quad.tlx,quad.tly), new cr.vector2(quad.blx,quad.bly), violet);
	renderer.Line(new cr.vector2(quad.trx,quad.try_), new cr.vector2(quad.brx,quad.bry), violet);
	renderer.Line(new cr.vector2(quad.tlx,quad.tly), new cr.vector2(quad.trx,quad.try_), blue);
	renderer.Line(new cr.vector2(quad.blx,quad.bly), new cr.vector2(quad.brx,quad.bry), blue);
	cr.quad.prototype.offset.call(quad, 4, 2);
	this.font.DrawText("Test dialog level runtime", quad,cr.RGB(0, 0, 0), ha_left, 1, 0/*this.instance.GetAngle()*/);
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;
}
