function QRNodeSequence() {
    this.nodes = [];
}

QRNodeSequence.prototype.last = function() {
    if (this.nodes.length)
        return this.nodes[this.nodes.length - 1];
    else return null;
};

QRNodeSequence.prototype.first = function() {
    if (this.nodes.length)
        return this.nodes[0];
    else return null;
};

QRNodeSequence.prototype.push = function(node) {
    this.nodes.push(node);
};

QRNodeSequence.prototype.pop = function() {
    return this.nodes.pop();
};

QRNodeSequence.prototype.count = function() {
    return this.nodes.length;
};
