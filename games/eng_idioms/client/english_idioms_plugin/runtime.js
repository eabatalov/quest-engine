// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.EnglishIdiomsPlugin = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.EnglishIdiomsPlugin.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;

		LEARZ.init({
            clientId : "fbf4aRfDx88dnvIdwwavX3C5EVH06c"
        });
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

		this.currentQuestionIx = -1;
		this.questionList = QUESTIONS_LIST;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
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

	//Instance private methods
	instanceProto._getCurrentQuestion = _getCurrentQuestion;

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.nextQuestionReady = EIPnextQuestionReady;
	Cnds.prototype.haveNoMoreQuestions = EIPHaveNoMoreQuestions;
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.prepareNextQuestion = EIPprepareNextQuestion;
	Acts.prototype.fillCurrentQuestion = EIPFillWithCurrentQuestion;
	Acts.prototype.answerCurrentQuestion = EIPAnswerCurrentQuestion;
	Acts.prototype.storeGameResults = EIPStoreGameResults;
	Acts.prototype.showAnsweredQuestions = EIPShowAnsweredQuestions;

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());

//Events
function EIPnextQuestionReady() {
	return this.questionList.length > this.currentQuestionIx;
}

function EIPHaveNoMoreQuestions() {
	return this.questionList.length <= this.currentQuestionIx;
}

//Actions
function EIPprepareNextQuestion() {
	++this.currentQuestionIx;
	var pluginProto = cr.plugins_.EnglishIdiomsPlugin.prototype;
	this.runtime.trigger(pluginProto.cnds.nextQuestionReady, this);
	this.runtime.trigger(pluginProto.cnds.haveNoMoreQuestions, this);
}

function EIPAnswerCurrentQuestion(answerNumberStr) {
	var answerNumberInt = parseInt(answerNumberStr);
	if (answerNumberInt === NaN) {
		throw { text : "You should supply string value to action 'answerCurrentQuestion'" };
	}
	if (!(answerNumberInt >= 1 && answerNumberInt <= 4)) {
		throw { text : "answerNumberStr value can be only between 1 and 4" };
	}

	this._getCurrentQuestion().answeredAnswer = answerNumberInt;
}

function EIPShowAnsweredQuestions() {
	var answers = "ANSWERED AUESTIONS RESULTS:\n";
	for (var i = 0; i < this.currentQuestionIx; ++i) {
		var question = this.questionList[i];
		answers += "Question " + question.id.toString() + " : " +
			(question.rightAnswer === question.answeredAnswer ? "right" : "wrong") + "\n";
	}
	alert(answers);
}

function EIPFillWithCurrentQuestion(EIPQuestionType) {
	var currentQuestion = this._getCurrentQuestion();
	EIPQuestionType.id = currentQuestion.id;
	EIPQuestionType.text = currentQuestion.text;
	EIPQuestionType.answer1 = currentQuestion.answers[0].text;
	EIPQuestionType.answer2 = currentQuestion.answers[1].text;
	EIPQuestionType.answer3 = currentQuestion.answers[2].text;
	EIPQuestionType.answer4 = currentQuestion.answers[3].text;
	EIPQuestionType.rightAnswer = currentQuestion.rightAnswer;
	EIPQuestionType.answerExplanation = currentQuestion.answerExplanation;
	EIPQuestionType.answeredAnswer = currentQuestion.answeredAnswer;
}

function EIPStoreGameResults() {
	alert("Storing game results is temporarely disabled (until global server is ready).");
	return;
	var eipInstance = this;
	var correctAnswersCount = 0;
	for (var i = 0; i < this.currentQuestionIx; ++i) {
		var question = this.questionList[i];
		if (question.rightAnswer === question.answeredAnswer)
			++correctAnswersCount;
	}
	//Save results to the platform
	LEARZ.services.user.get(function(apiResponse) {
		if (apiResponse.status === LEARZING_STATUS_SUCCESS) {

			var currentUser =  apiResponse.data;
			LEARZ.services.skills.getUserSkill(currentUser.id, LEARZ_SKILL_ID_ENGLISH_IDIOMS,

			function(apiResponse) {
				if (apiResponse.status === LEARZING_STATUS_SUCCESS) {

					var currentEnglishIdiomsSkill = apiResponse.data[0];
					currentEnglishIdiomsSkill.value += correctAnswersCount;

					LEARZ.services.skills.put(currentEnglishIdiomsSkill.skill_id, currentEnglishIdiomsSkill.value,
						function(apiResponse) {
							if (apiResponse.status !== LEARZING_STATUS_SUCCESS) {
								alert("Error occured:\n" + apiResponse.texts.toString());
							} else {
								alert("User skills changes were saved to the platform successfully");
							}
					});

				} else {
		            alert("Error occured:\n" + apiResponse.texts.toString());
		        }
			});
        } else {
            alert("Error occured:\n" + apiResponse.texts.toString());
        }
	});
}

//Private
function _getCurrentQuestion() {
	return this.questionList[this.currentQuestionIx];
}
