var winston = require('winston');
winston.add(winston.transports.File, {
    filename: 'replay_server.log',
    handleExceptions: true
});
winston.exitOnError = true;

var logger = winston;
