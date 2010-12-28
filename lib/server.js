var putils = require('./putils');

exports.broker_controller = {
   subscriptions: [],
   subscriber_POST: function(req, params, res) {
      var subfunc_s = params.get('subscription_function', null);
      if(subfunc_s != null) {
	 eval("var subfunc = " + subfunc_s);
	 this.subscriptions.push([subfunc, subfunc_s]);
	 res.text("OK");
      } else {
	 res.fourohfour("subscription_function not given.");
      }
   },
   subscriber_GET: function(req, params, res) {
      res.text(this.subscriptions.map(function(s) { return s[1]; }).join("\n"));
   },
   event_POST: function(req, params, res) {
      var event = JSON.parse(params.get('event', '{}'));
      var key = params.get('key', '');
      this.subscriptions.forEach(function(sub) { sub.call(key, event) });
   },
}

