function TestDialogScript(name, sections, polyProps) {
    this._name = name;
    this._sections = sections;
    this._polyProps = polyProps;
}

TestDialogScript.prototype.getName = function() {
    return this._name;
};

TestDialogScript.prototype.getSections = function() {
    return this._sections;
};

TestDialogScript.prototype.getPolyProp = function(propName) {
    var value = this._polyProps && this._polyProps[propName];
    return value ? value : "";
};

TestDialogScript.prototype.save = function() {
    var sections = jQuery.map(this._sections,
        function(section) {
            return section.save();
        }
    );
    var savedData = {
        "name" : this._name,
        "sections" : sections,
        "polyProps" : this._polyProps
    };
    return savedData;
};

TestDialogScript.load = function(savedData) {
    var name = savedData["name"];
    var sections = jQuery.map(savedData["sections"],
        function(sectionSaved) {
            return TestDialogSection.load(sectionSaved);
        }
    );
    var polyProps = savedData["polyProps"];
    return new TestDialogScript(name, sections, polyProps);
};
