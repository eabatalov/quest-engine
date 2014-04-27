function assert(assertion, msg) {
    if (!assertion)
        throw msg || "assertion failure";
}

function collectionObjectDelete(ix, obj) {
    obj.delete();
};

function collectionListOfObjectsDelete(ix, list) {
    jQuery.each(list, collectionObjectDelete);
};
