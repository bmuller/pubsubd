var broker = require('./restbroker');
var server = require('./server');

broker.addController(server.broker_controller, "broker");

// called with host, port
exports.runServer = broker.runServer;
exports.readConfig = require('./config').readConfig;