/* ==== NOTIFICATION ==== */
function ScriptNotification(scriptElement, text, level, notificationCenter) {
    this.scriptElement = scriptElement;
    this.text = text;
    this.level = level;
    this.notificationCenter = notificationCenter;
    //XXX temporal until notifications console consumer is not built
    console.log("Script notification created: " + this.level + " " + this.text + " \n " +
        "script element: " + JSON.stringify(this.scriptElement.save()));
}

ScriptNotification.prototype.delete = function(selfCleanup) {
    selfCleanup = selfCleanup || false;

    //Double deleteion protection
    if (!this.level)
        return;

    if (!selfCleanup && this.notificationCenter) {
        //XXX temporal until notifications console consumer is not built
        console.log("Script notification deleted: " + this.level + " " + this.text + " \n " +
            "script element: " + JSON.stringify(this.scriptElement.save()));

        this.notificationCenter.removeNotification(this);
    }

    delete this.notificationCenter;
    delete this.scriptElement;
    delete this.text;
    delete this.level;
};

ScriptNotification.LEVELS = {
    INFO : "INFO",
    WARNING : "WARNING",
    ERROR : "ERROR"
};

ScriptNotification.prototype.save = function() {
    //TODO
    return null;
};

ScriptNotification.load = function(savedData) {
    //TODO
    return null;
};

ScriptNotification.prototype.getScriptElement = function() {
    return this.scriptElement;
};

ScriptNotification.prototype.getText = function() {
    return this.text;
};

ScriptNotification.prototype.getLevel = function() {
    return this.level;
};

/* ==== NOTIFICATION CENTER ==== */
function ScriptNotificationCenter(script) {
    this.script = script;
    this.notificationsByElement = new ObjectMap();
    this.notifications = new ObjectMap();
    this.events = {
        notificationAdded : new SEEvent(), /* function(notification) */
        notificationRemoved : new SEEvent() /* function(notification) */
    };
}

ScriptNotificationCenter.prototype.delete = function() {
    delete this.script;
    this.notificationsByElement.each(function(ix, elemNotifications) {
        elemNotifications.each(collectionObjectDelete);
    });
    delete this.notificationsByElement;
    this.notifications.each(collectionObjectDelete);
    delete this.notifications;
    jQuery.each(this.events, collectionObjectDelete);
    delete this.events;
};

ScriptNotificationCenter.prototype.save = function() {
    //TODO
    return null;
};

ScriptNotificationCenter.load = function(savedData) {
    //TODO
    return null;
};

ScriptNotificationCenter.prototype.removeNotification = function(notification) {
    this.notificationsByElement.get(notification.getScriptElement()).
        remove(notification);
    this.notifications.remove(notification);
    this.events.notificationRemoved.publish(notification);
    notification.delete(true);
};

ScriptNotificationCenter.prototype.addNotification = function(scriptElement, text, level) {
    var notification = new ScriptNotification(scriptElement, text, level, this);
    if (!this.notificationsByElement.contains(scriptElement)) {
        this.notificationsByElement.put(scriptElement, new ObjectMap());
    }
    var elementNoitifications = this.notificationsByElement.get(scriptElement);
    elementNoitifications.put(notification, notification);
    this.notifications.put(notification, notification);
    this.events.notificationAdded.publish(notification);
    return notification;
};

ScriptNotificationCenter.prototype.getNotifications = function() {
    //TODO
    return [];//this.notifications;
};

ScriptNotificationCenter.prototype.getScriptElementNotifications = function(scriptElement) {
    //TODO
    return [];//this.notificationsByElement.get(scriptElement);
};
