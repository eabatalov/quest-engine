/*
 * Socket.IO game server demo
 * author: eugene
 */
var io = require('socket.io').listen(8081, {
    origins: "*:*"
});
SIO_LOG_LEVEL_DEBUG = 3;
SIO_LOG_LEVEL_INFO = 2;
SIO_LOG_LEVEL_WARN = 1;
SIO_LOG_LEVEL_ERROR = 0;
io.set('log level', SIO_LOG_LEVEL_DEBUG);

io.sockets.on('connection', function (socket) {

    //some fun
    socket.emit('down');
    socket.emit('down');
    socket.emit('down');
    socket.emit('down');
    socket.emit('down');
    socket.emit('down');
    socket.emit('right');
    socket.emit('right');
    socket.emit('right');

    socket.on('message', function (msg) {
        console.log(msg);
    });

    socket.on('left arrow key', function() {
        console.log('left');
        socket.emit('left');
    });

    socket.on('right arrow key', function() {
        console.log('right');
        socket.emit('right');
    });

    socket.on('up arrow key', function() {
        console.log('up');
        socket.emit('up');
    });

    socket.on('down arrow key', function() {
        console.log('down');
        socket.emit('down');
    });
});