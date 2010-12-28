var httphelp = require('./httphelp.js');

var client = httphelp.createClient('127.0.0.1', 8000);
client.post('/cont/handle', {'var1': "brian"}, function(response) {
	      console.log("result: " + response.data + "\n");
	   });