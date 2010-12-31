var pubsubd = require('pubsubd');

if(process.argv.length != 3) {
   console.error("Usage: " + process.argv[1] + " <config file path>");
   process.exit(1);
}

var config = pubsubd.readConfig(process.argv[2]);
if(config != null) {
   pubsubd.runServer(config);
} else {
   console.error("Problem reading config file.  Exiting in disgrace.");
   process.exit(1);
}