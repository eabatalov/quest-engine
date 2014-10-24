function AjaxTextFileLoader(baseUrl) {
    this.baseUrl = baseUrl ? baseUrl + '/' : '';
}

AjaxTextFileLoader.prototype = new ITextFileLoader();
AjaxTextFileLoader.prototype.constructor = AjaxTextFileLoader;

AjaxTextFileLoader.prototype.load = function(filePath, callback) {
    var fileUrl = this.baseUrl + filePath;
    console.log("Loading text file by URL: " + fileUrl);

    jQuery.get(fileUrl, function(data) {
        console.log("Text file " + filePath + " load was performed");
        if (callback)
            callback(data);
    }, "text");
};
