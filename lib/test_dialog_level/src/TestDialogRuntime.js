/*
 * @isDebugMode: if true, ask all the question from @script,
 *  otherwise ask 1 randomly selected question per situation.
 */
function TestDialogRuntime(script, isDebugMode) {
    if (!script)
        return; //inherit
    this._script = script;
    this._questions = [];
    this._currentQuestionToAskIx = -1;
    this._stats = {
        answersCount : 0,
        rightAnswersCount : 0
    };
    isDebugMode = isDebugMode ||
        this._script.getPolyProp("debug") === "yes";
    this._computeDialog(isDebugMode);
}

TestDialogRuntime.Question = function(question, section) {
    this._question = question;
    this._section = section;
};

TestDialogRuntime.Question.prototype.getTDQuestion = function() {
    return this._question;
};

TestDialogRuntime.Question.prototype.getTDSection = function() {
    return this._section;
};

/*
 * returns current question or null.
 * if null - dialog is finished.
 */
TestDialogRuntime.prototype.getCurrentQuestion = function() {
    return this._isCurrenQuestionAvaliable() ?
        this._questions[this._currentQuestionToAskIx].getTDQuestion() :
        null;
};

TestDialogRuntime.prototype.getCurrentQuestionSection = function() {
    return this._isCurrenQuestionAvaliable() ?
        this._questions[this._currentQuestionToAskIx].getTDSection() :
        null;
};

TestDialogRuntime.prototype.getScript = function() {
    return this._script;
};

TestDialogRuntime.prototype.getAnswersCount = function() {
    return this._stats.answersCount;
};

TestDialogRuntime.prototype.getRightAnswersCount = function() {
    return this._stats.rightAnswersCount;
};

TestDialogRuntime.prototype.getQuestionsCount = function() {
    return this._questions.length;
};

/*
 * Returns true if the answers is right,
 * false otherwise.
 */
TestDialogRuntime.prototype.answerCurrentQuestion = function(answer) {
    if (!this._isCurrenQuestionAvaliable())
        return false;

    //Update idiom status of current level
    var rightAnswer = this.getCurrentQuestion().getRightAnswer();
    var isAnswerRight = rightAnswer === answer;
    //stats
    this._stats.rightAnswersCount = isAnswerRight ?
        this._stats.rightAnswersCount + 1 :
        this._stats.rightAnswersCount;
    this._stats.answersCount++;
    return isAnswerRight;
};

TestDialogRuntime.prototype.nextQuestion = function() {
    this._currentQuestionToAskIx++;
};

TestDialogRuntime.prototype._computeDialog = function(isDebugMode) {
    var sections = this._script.getSections();
    for (var sectIx = 0; sectIx < sections.length; ++ sectIx) {
        var section = sections[sectIx];
        var sectQuestions  = section.getQuestions();
        if (isDebugMode) {
            var sectQuestionIx = 0;
            for (;sectQuestionIx < sectQuestions.length; ++sectQuestionIx) {
                var sectQuestion = sectQuestions[sectQuestionIx];
                this._questions.push(
                    new TestDialogRuntime.Question(sectQuestion, section)
                );
            }
        } else {
            var randSectQuestionIx = getRandomInt(0, sectQuestions.length - 1);
            var randSectQuestion = sectQuestions[randSectQuestionIx];
            this._questions.push(
                new TestDialogRuntime.Question(randSectQuestion, section)
            );
        }
    }
};

TestDialogRuntime.prototype._isCurrenQuestionAvaliable = function() {
    return (this._currentQuestionToAskIx >= 0) &&
        (this._currentQuestionToAskIx < this._questions.length);
};
