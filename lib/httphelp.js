var http = require('http');
var querystring = require('querystring');
require('./futils');

function respond(text, headers, code, httpres) {
   httpres.writeHead(code, headers);
   httpres.end(text);
}

exports.response = function(httpres) {
   return { 
      text: function(text) { respond(text, {'Content-Type': "text/plain"}, 200, httpres); },
      html: function(html) { respond(html, {'Content-Type': "text/html"}, 200, httpres); },
   };
};

function makeRequest(host, port, method, url, params, callback) {
   var client = http.createClient(port, host);
   if(method == "GET")
      url = url + "?" + querystring.stringify(params);
   var request = client.request(method, url, {'host': host});
   var data = (method != "GET") ? querystring.stringify(params) : "";
   request.end(data);
   request.on('response', function(response) {
		 response.setEncoding('utf8');
		 response.data = "";
		 response.on('data', function(chunk) { response.data += chunk; });
		 response.on('end', function() { callback(response); });
	      });
};

exports.createClient = function(host, port) {
   var request = makeRequest.curry(host, port);
   return {
      get: request.curry('GET'),
      post: request.curry('POST'),
      put: request.curry('PUT'),
      delete: request.curry('DELETE'),
   };
};