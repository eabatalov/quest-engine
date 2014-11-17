/*
 * name : string
 * questions : [TestDialogQuestion]
 */
function TestDialogSection(questions, polyProps) {
    this._questions = questions;
    this._polyProps = polyProps;
}

TestDialogSection.prototype.getQuestions = function() {
    return this._questions;
};

TestDialogSection.prototype.getPolyProp = function(propName) {
    var value = this._polyProps && this._polyProps[propName];
    return value ? value : "";
};

TestDialogSection.prototype.save = function() {
    var questionsSaved = jQuery.map(this.questions,
        function(question) {
            return question.save();
         }
    );

    var savedData = {
        "questions" : questionsSaved,
        "polyProps" : this._polyProps
    };
    return savedData;
};

TestDialogSection.load = function(savedData) {
    var polyProps = savedData["polyProps"];
    var questions = jQuery.map(savedData["questions"],
        function(questionSaved) {
            return TestDialogQuestion.load(questionSaved);    
        }
    );
    return new TestDialogSection(questions, polyProps);
};
