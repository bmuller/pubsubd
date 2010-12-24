var http = require('http');
var querystring = require('querystring');

function respond(text, headers, code, httpres) {
   httpres.writeHead(code, headers);
   httpres.end(text);
}

exports.response = function(httpres) {
   return { 
      'text': function(text) { respond(text, {'Content-Type': "text/plain"}, 200, httpres); },
      'html': function(html) { respond(html, {'Content-Type': "text/html"}, 200, httpres); },
   };
};

function makeRequest(host, url, port, method, params, callback) {
   var client = http.createClient(port, host);
   if(method == "GET")
      url = url + "?" + querystring.stringify(params);
   var request = client.request(method, url, {'host': host});
   var data = (method != "GET") ? querystring.stringify(params) : "";
   request.end(data);
   request.on('response', function(response) {
		 response.setEncoding('utf8');
		 response.data = "";
		 response.on('data', function (chunk) { response.data += chunk; });
		 response.on('end', function() { callback(response); });
	      });
};

exports.createClient = function(host, port) {
   return {
      'host': host,
      'port': port,
      'get': function(url, params, callback) { makeRequest(this.host, url, this.port, 'GET', params, callback); },
      'post': function(url, params, callback) { makeRequest(this.host, url, this.port, 'POST', params, callback); },
      'put': function(url, params, callback) { makeRequest(this.host, url, this.port, 'PUT', params, callback); },
      'delete': function(url, params, callback) { makeRequest(this.host, url, this.port, 'DELETE', params, callback); },
   };
};