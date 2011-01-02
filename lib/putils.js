function args() { return Array.prototype.slice.call(arguments.callee.caller.arguments, 0); }

Function.prototype.curry = function() {
   var f = this, aargs = args();
   return function() {
      return f.apply(this, aargs.concat(args()));
   };
};

// Redefine the params list for a function.  For instance:
// function blah(one, two, three) { alert(one + " " + two + " " + three); };
// var newblah = blah.redef(function(two) { return ['one', two, 'three'] });
// newblah('two'); -> produces "one two three"
Function.prototype.redef = function(f) {
   var orig = this;
   return function() {
      return orig.apply(this, f.apply(this, arguments));
   }
};

Array.prototype.select = function(f) {
   var selected = [];
   this.forEach(function(elem) { if(f(elem)) selected.push(elem); });
   return selected;
};

Array.prototype.first = function() { 
   return this[0];
};

Array.prototype.rest = function() {
   return this.slice(1);
};

Array.prototype.mapMethod = function() {
   var a = args();
   return this.map(function(x) {
		      return x[a.first()].apply(x, a.rest());
		   });
};

Array.prototype.subGroup = function(maxsize) { 
   var n = [];
   for(var index=0; index<this.length; index+=maxsize) 
      n.push(this.slice(index, index+maxsize));
   if(index < (this.length - 1))
      n.push(this.slice(index));
   return n;
};

String.prototype.trim = function () {
   return this.replace(/^[\s|\n|\t]*/, "").replace(/[\s|\n|\t]*$/, "");
}

exports.trycatch = function() { 
   var a = args();
   try {
      return a.first().apply(null, a.rest());
   } catch(err) {
      console.error(err.description);
      return null;
   }
};