var broker = require('./restbroker');
var server = require('./server');

broker.addController(server.broker_controller, "broker");

// called with host, port
exports.startServer = broker.runServer;