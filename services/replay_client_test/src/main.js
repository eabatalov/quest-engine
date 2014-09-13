//emulate socket.io web client
var io = require('socket.io-client');

(function main() {
    function startGamingSessionTests() {
        new GamingSessionTest();
        /*new GamingSessionTest();
        new GamingSessionTest();
        new GamingSessionTest();
        new GamingSessionTest();*/
    };

    function schedGamingSessionTests() {
        setTimeout(function() {
            startGamingSessionTests();
            schedGamingSessionTests();
        }, MAX_REPLAY_TIME_MS);
    };

    startGamingSessionTests();
    //schedGamingSessionTests();
})();
