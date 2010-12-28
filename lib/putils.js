Function.prototype.args = function() { return Array.prototype.slice.call(arguments.callee.caller.arguments, 0); };

Function.prototype.curry = function() {
   var f = this, aargs = this.args();
   return function() {
      return f.apply(this, aargs.concat(Array.prototype.slice.call(arguments, 0)));
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
