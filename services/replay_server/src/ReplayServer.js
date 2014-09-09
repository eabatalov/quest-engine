var srvSock = null;
var fs = require('fs');

function startServer() {
    var httpServer = require('http').createServer();
    srvSock = require('socket.io')(httpServer);
    srvSock.on('connection', onClientConnected);

    httpServer.listen(REPLAY_SERVER_CONFIG.LISTEN_PORT, REPLAY_SERVER_CONFIG.LISTEN_HOSTNAME);

    logger.info("Replay server has started");
}

function main() {
    startServer();
}

main();
