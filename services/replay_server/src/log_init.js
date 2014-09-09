var winston = require('winston');
winston.add(winston.transports.File, {
    filename: 'replay_server.log',
    handleExceptions: true
});

var logger = winston;
