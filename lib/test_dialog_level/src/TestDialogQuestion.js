/*
 * text : string
 * rightAnswer : boolean
 */
function TestDialogQuestion(text, rightAnswer, polyProps) {
    this._text = text;
    this._rightAnswer = rightAnswer;
    this._polyProps = polyProps;
}

TestDialogQuestion.prototype.getText = function() {
    return this._text;
};

TestDialogQuestion.prototype.getRightAnswer = function() {
    return this._rightAnswer;
};

TestDialogQuestion.prototype.getPolyProp = function(propName) {
    var value = this._polyProps && this._polyProps[propName];
    return value ? value : "";
};

TestDialogQuestion.prototype.save = function() {
    /*
     * Human written files contain list of strings as text.
     * Lists allow to make good human readable formating in json files.
     */
    var savedData = {
        "text" : [this._text],
        "rightAnswer" : this._rightAnswer,
        "polyProps" : this._polyProps
    };
    return savedData;
};

TestDialogQuestion.load = function(savedData) {
    var text = savedData["text"].join("");
    var rightAnswer = savedData["rightAnswer"];
    var polyProps = savedData["polyProps"];
    return new TestDialogQuestion(text, rightAnswer, polyProps);
};
