var http = require('http');
var url = require('url');
var querystring = require('querystring');
var util = require('util');

var httphelp = require('./httphelp.js');

CONTROLLERS = {}

function makeParams(values) {
   return {
      'values': values,
      'set': function(key, value) { this.values[key] = value; },
      'get': function(key, def) { return (key in this.values) ? this.values[key] : def; },
      'has': function(key) { return (key in this.values); }
   };
};

exports.addController = function(controller, pathname) {
   CONTROLLERS[pathname] = controller;
};

exports.runServer = function(config) {
   var port = config.get('port', '8000');
   var host = config.get('host', 'localhost');
   http.createServer(function (req, res) {
			util.log("Received request for " + req.url + " from " + req.connection.remoteAddress);
			req.urlparts = url.parse(req.url, parseQueryString=true);
			req.pathparts = req.urlparts.pathname.split('/').slice(1);
			req.postdata = "";
			req.on('data', function(chunk) { req.postdata += chunk });
			req.on('end', function() { broker(req, httphelp.response(res)); });
		     }).listen(port, host);
   util.log('REST broker server running at http://' + host + ':' + port + '/');
};

function broker(request, response) {
   if(request.pathparts[0] == "" || !(request.pathparts[0] in CONTROLLERS))
      return response.text("Controller named \"" + request.pathparts[0] + "\" could not be found.");

   var cont = CONTROLLERS[request.pathparts[0]];
   var action = (request.pathparts.length > 1 && request.pathparts[1] != "") ? request.pathparts[1] : "index";
   var actionwmethod = action + "_" + request.method;
   var params = (request.method == 'GET') ? request.urlparts.query : querystring.parse(request.postdata);
   // try action_METHOD first, then just action
   if(actionwmethod in cont) 
      return cont[actionwmethod](request, makeParams(params), response);
   if(action in cont)
      return cont[action](request, makeParams(params), response);

   var msg = "Could not find function \"" + action + "\" in controller \"" + request.pathparts[0] + "\"";
   return response.text(msg);
};

