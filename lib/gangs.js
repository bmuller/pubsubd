var fs = require('fs');
var putils = require('./putils');

function getHosts(config) { 
   var fname = config.get('hostfile', 'hosts');
   var contents = "";
   try {
      contents = fs.readFileSync(fname, 'utf8');  
   } catch(err) {
      console.error("Error reading hosts file " + fname + ": " + err + ".  Using only localhost.");
   }
   contents = (contents=="") ? "localhost" : contents;
   return contents.split("\n").mapMethod('trim').sort();
};

function setHosts(hosts, config) {
   var fname = config.get('hostfile', 'hosts');
   try {
      fs.writeFileSync(fname, hosts.join("\n"), 'utf8');
   } catch(err) {
      console.error("Error writing hosts file " + fname + ": " + err);
   }
};

exports.createList = function(config) { 
   return {
      config: config,
      hosts: getHosts(this.config),
      gangsize: this.config.get('gangsize', Math.min(10, Math.floor(Math.sqrt(this.hosts.length)))),
      gangs: this.hosts.subGroup(this.gangsize),
      save: setHosts(this.hosts, config)
   }
};

