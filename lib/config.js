var fs = require('fs');

function makeConfig(json) {
   return { 
      json: json,
      get: function(key, def) { return (key in this.json) ? this.json[key] : def }
   }
};

exports.readConfig = function(configLocation) {
   try {
      var contents = fs.readFileSync(configLocation, 'utf-8');
      return makeConfig(JSON.parse(contents));
   } catch(err) {
      console.error("Error reading config file " + configLocation + ": " + err);
      return null;
   }
};