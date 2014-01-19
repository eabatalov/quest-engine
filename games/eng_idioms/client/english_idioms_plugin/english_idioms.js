$(function() {
  LEARZ.init({
	            clientId : "fbf4aRfDx88dnvIdwwavX3C5EVH06c"
	});
});

/*
	This class contains all the game logic and state.
*/
function EnglishIdiomsGame() {
	this.currentQuestionIx = -1;
	this.questionList = QUESTIONS_LIST;
}

EnglishIdiomsGame.prototype.checkNextQuestionIsReady = function() {
	return this.questionList.length > this.currentQuestionIx;
};

EnglishIdiomsGame.prototype.checkNoMoreQuestions = function() {
	return this.questionList.length <= this.currentQuestionIx;
};

EnglishIdiomsGame.prototype.prepareNextQuestion = function(obj, callback) {
	++this.currentQuestionIx;
	callback.call(obj);
};

EnglishIdiomsGame.prototype.answerCurrentQuestion = function(answerIx) {
	if (!(answerIx >= 0 && answerIx <= 3)) {
		throw { text : "answerIx value can be only between 0 and 3" };
	}
	this._getCurrentQuestion().answeredAnswerIx = answerIx;
};

EnglishIdiomsGame.prototype.showAnsweredQuestions = function() {
	var answers = "ANSWERED QUESTIONS RESULTS:\n";
	for (var i = 0; i < this.currentQuestionIx; ++i) {
		var question = this.questionList[i];
		answers += "Question " + question.id.toString() + " : " +
			(question.rightAnswerIx === question.answeredAnswerIx ? "right" : "wrong") + "\n";
	}
	alert(answers);
};

EnglishIdiomsGame.prototype.fillWithCurrentQuestion = function(obj) {
	var curQuest = this._getCurrentQuestion();
	obj.id = curQuest.id;
	obj.text = curQuest.text;
	obj.answer1 = curQuest.answers[0].text;
	obj.answer2 = curQuest.answers[1].text;
	obj.answer3 = curQuest.answers[2].text;
	obj.answer4 = curQuest.answers[3].text;
	obj.rightAnswerNumber = curQuest.rightAnswerIx + 1;
	obj.answerExplanation = curQuest.answerExplanation;
	obj.answeredAnswer = curQuest.answeredAnswer;
};

EnglishIdiomsGame.prototype.storeGameResults = function() {
	
	//Save results to the platform
	LEARZ.services.skills.getUserSkill(LEARZ_SKILL_ID_ENGLISH_IDIOMS,
			function(apiResponse) {
				if (apiResponse.status === LEARZING_STATUS_SUCCESS) {

					var currentEnglishIdiomsSkill = apiResponse.data[0];
					currentEnglishIdiomsSkill.value += this._computeGamePoints();

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
	});
};

EnglishIdiomsGame.prototype._getCurrentQuestion = function() {
	return this.questionList[this.currentQuestionIx];
};

EnglishIdiomsGame.prototype._computeGamePoints = function() {
	var correctAnswersCount = 0;
	for (var i = 0; i < this.currentQuestionIx; ++i) {
		var question = this.questionList[i];
		if (question.rightAnswer === question.answeredAnswer)
			++correctAnswersCount;
	}
	return correctAnswersCount;
};
