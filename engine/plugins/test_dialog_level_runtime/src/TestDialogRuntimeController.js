/*
 * Base class for different test dialogs in your game
 */
function TestDialogRuntimeController(testDialogRuntime) {
    this._runtime = testDialogRuntime;
    this.events = {
        onQuestionAnswered : new SEEvent(/*bool isAnswered right */),
        onQuestionIsAvaliable : new SEEvent(),
        onTestCompleted : new SEEvent()
    };
}

TestDialogRuntimeController.prototype.getCurrentQuestionText = function() {
    return this._runtime.getCurrentQuestion().getText();
};

TestDialogRuntimeController.prototype
    .getCurrentQuestionPolyProp = function(propName) {
    return this._runtime.getCurrentQuestionSituation().getPolyProp(propName);
};

TestDialogRuntimeController.prototype
    .getCurrentQuestionSectionPolyProp = function(propName) {
    return this._runtime.getCurrentQuestionSection().getPolyProp(propName)
};

TestDialogRuntimeController.prototype.getQuestionsCount = function() {
    return this._runtime.getQuestionsCount();
};

TestDialogRuntimeController.prototype.getRightAnswersCount = function() {
    return this._runtime.getRightAnswersCount();
};

TestDialogRuntimeController.prototype.getAnswersCount = function() {
    return this._runtime.getAnswersCount();
};

TestDialogRuntimeController.prototype.answerCurrentQuestion = function(answer) {
    var boolAnswer = false;
    switch (answer) {
        case "TRUE":
            boolAnswer = true;
        break;
        case "FALSE":
            boolAnswer = false;
        break;
        default:
            throw new Error("Invalid answer value: " + answer);
    };
    this.events.onQuestionAnswered.publish(
        this._runtime.answerCurrentQuestion(boolAnswer)
    );
};

TestDialogRuntimeController.prototype.waitNextQuestion = function() {
    this._runtime.nextQuestion();
    if (this._runtime.getCurrentQuestion() === null) {
        this.events.onTestCompleted.publish();
    } else {
        this.events.onQuestionIsAvaliable.publish();
    }
};
