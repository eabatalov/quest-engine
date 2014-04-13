function SEEventHandler(thiz, callback, ev) {
    this.thiz = thiz;
    this.callback = callback;
    this.ev = ev;
}

SEEventHandler.prototype.delete = function() {
    this.ev.deleteEH(this);
    delete this.id;
    delete this.thiz;
    delete this.callback;
    delete this.ev;
};

function SEEvent() {
    this.subscribers = [];
}

SEEvent.prototype.delete = function() {
    jQuery.each(this.subscribers, function(ix, evHandler) {
            evHandler.delete();
    });
    delete this.subscribers;
};

SEEvent.prototype.subscribe = function(thiz, callback) {
    var eh = new SEEventHandler(thiz, callback, this);
    this.subscribers.push(eh);
    return eh;
};

SEEvent.prototype.publish = function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].callback.apply(this.subscribers[i].thiz, args);
    }
};

SEEvent.prototype.deleteEH = function(delEH) {
    for (var i = 0; i < this.subscribers.length; i++) {
        var eh = this.subscribers[i];
        if (eh === delEH) {
            this.subscribers.splice(i, 1);
            return;
        }
    }   
};
