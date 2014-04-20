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

/* ==== ObjectMap ==== */
//Uses objects reference equality
function ObjectMap() {
    this.map = [];
};

ObjectMap.prototype.put = function(obj, value) {
    for (var i = 0; i < this.map.length; ++i) {
        var listObjEntry = this.map[i];
        if (listObjEntry.key === obj) {
            listObjEntry.value = value;
            return;
        }
    }
    this.map.push({ key : obj, value : value });
};

ObjectMap.prototype.get = function(obj) {
    for (var i = 0; i < this.map.length; ++i) {
        var listObjEntry = this.map[i];
        if (listObjEntry.key === obj)
            return listObjEntry.value;
    }
};

ObjectMap.prototype.remove = function(obj) {
    for (var i = 0; i < this.map.length; ++i) {
        var listObjEntry = this.map[i];
        if (listObjEntry.key === obj) {
            this.map.splice(i, 1);
            return;
        }
    }
};

ObjectMap.prototype.contains = function(obj) {
    for (var i = 0; i < this.map.length; ++i) {
        var listObjEntry = this.map[i];
        if (listObjEntry.key === obj) {
            return true;
        }
    }
    return false;
};

/* callback: function(obj, value) */
ObjectMap.prototype.each = function(callback, thiz) {
    for (var i = 0; i < this.map.length; ++i) {
        var listObjEntry = this.map[i];
        if (thiz)
            obj.call(thiz, listObjEntry.key, listObjEntry.value);
        else
            callback(listObjEntry.key, listObjEntry.value);
    }
};
