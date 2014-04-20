function ValidationBroker(
    condTypeFilter,
    notificationCenter
) {
    this.condTypeFilter = condTypeFilter;
    this.notificationCenter = notificationCenter;

    this.evHandlers = [
        this.condTypeFilter.events.condTypeValidityChanged.subscribe(this, this.condTypeValidityChanged)
    ];
    this.validationInfos = new ObjectMap();
}

ValidationBroker.prototype.delete = function() {
    jQuery.each(this.evHandlers, collectionObjectDelete);
    delete this.eventHandlers;
    this.validationInfos.each(collectionObjectDelete);
    delete this.validationInfos;
    delete this.condTypeFilter;
    delete this.notificationCenter;
};

ValidationBroker.prototype.save = function() {
    //TODO
    return null;
};

ValidationBroker.prototype.load = function(savedData) {
    //TODO
    return null;
};

ValidationBroker.condValidationInfo = function() {
    this.type = {
        valid : true,
        notification : null
    };
};

ValidationBroker.condValidationInfo.prototype.delete = function() {
    if (this.type.notification) {
        this.type.notification.delete();
    }
    delete this.type.notification;
    delete this.type.valid;
    delete this.type;
};

ValidationBroker.prototype.condTypeValidityChanged = function(cond, validity) {
    if (!this.validationInfos.contains(cond)) {
        this.validationInfos.put(cond, new ValidationBroker.condValidationInfo());
    }

    var validationInfo = this.validationInfos.get(cond);
    if (validationInfo.type.valid === validity)
        return;
    validationInfo.type.valid = validity;
    //was invalid, now valid
    if (validationInfo.type.valid) {
        if (validationInfo.type.notification !== null) {
            validationInfo.type.notification.delete();
            delete validationInfo.type.notification;
        }
        return;
    }
    //was valid, now invalid
    validationInfo.type.notification = this.notificationCenter.addNotification(
        cond,
        "Invalid condition type. Valid condition types: " + JSON.stringify(this.condTypeFilter.getValidCondTypes(cond)),
        ScriptNotification.LEVELS.ERROR
    );
};
