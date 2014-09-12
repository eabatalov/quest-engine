//==== Client data collection from web browser ====
LevelReplayInfo._getClientDeviceName = function() {
    return navigator ? navigator.userAgent : "unknown";
};

LevelReplayInfo._getClientScreenResolution = function() {
    var vr = window.screen.availHeight;
    vr = vr ? vr.toString() : "invalid";

    var hr = window.screen.availWidth;
    hr = hr ? hr.toString() : "invalid";
    return hr + "x" + vr;
};

LevelReplayInfo._getClientGameURL = function() {
    return document.URL ? document.URL : "unknown";
};
