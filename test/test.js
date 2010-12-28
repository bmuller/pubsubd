var broker = require('./restbroker');

var controller = {
   'test': function(req, params, res) {
      res.html("<form action=\"handle\" method=\"post\"><input type=\"text\" name=\"var1\" /><input type=\"submit\" value=\"go!\"/></form>");
   },
   'handle': function(req, params, res) {
      res.text("hello: " + params.get('var1', 'unknown'));
   }
}

broker.addController(controller, "cont");

broker.runServer("127.0.0.1", 8000);