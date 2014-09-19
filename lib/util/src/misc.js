function assert(assertion, msg) {
    if (!assertion)
        throw "assertion failure: " + (msg || "");
}

function collectionObjectDelete(ix, obj) {
    obj.delete();
};

function collectionListOfObjectsDelete(ix, list) {
    jQuery.each(list, collectionObjectDelete);
};

function JSONSafeParse(data) {
    try {
        return JSON.parse(data);
    } catch(err) {
        return null;
    }   
}
