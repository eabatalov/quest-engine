function SEEvent() {
    this.subscribers = [];
}

SEEvent.prototype.subscribe = function(thiz, callback) {
    this.subscribers.push({ thiz : thiz, callback : callback });
};

SEEvent.prototype.publish = function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i].callback.apply(this.subscribers[i].thiz, args);
    }
};
