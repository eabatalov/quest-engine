function TreeCompiler(scope, treeEditor, seEvents) {
    this.treeEditor = treeEditor;
    this.seEvents = seEvents;
    scope.$on('seEvent', this.onSeEvent.bind(this));
}

TreeCompiler.prototype.onSeEvent = function() {
    if (this.seEvents.args.name !== "COMPILE")
        return;
    alert("COMPILE!");
    var scriptText = "foobar";
    //compiling
    this.uploadCompiledScript(scriptText);
};

TreeCompiler.prototype.uploadCompiledScript = function(scriptText) {
    var scriptAsBlob = new Blob([scriptText], { type : 'text/javascript' });

    var downloadLink = document.createElement("a");
    downloadLink.download = "story.js";
    downloadLink.innerHTML = "Download Story";
    if (window.webkitURL !== null)
    {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(scriptAsBlob);
    }
    else
    {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(scriptAsBlob);
            downloadLink.onclick = this.destroyClickedScriptLink;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
    }

    downloadLink.click();
};

TreeCompiler.prototype.destroyClickedScriptLink = function(event) {
	document.body.removeChild(event.target);
};

function TreeCompilerFactory(scope, treeEditor, seEvents) {
    return new TreeCompiler(scope, treeEditor, seEvents);
}