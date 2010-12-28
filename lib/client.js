exports.jenkins_hash = function(key, size) {
   var hash = 0;
   for (var i=0; i<key.length; ++i) {
      hash += key.charCodeAt(i);
      hash += (hash << 10);
      hash ^= (hash >> 6);
   }
   hash += (hash << 3);
   hash ^= (hash >> 11);
   hash += (hash << 15);
   return hash % size;
   // make unsigned and modulo size
   return (hash >>> 0) % size;
}
