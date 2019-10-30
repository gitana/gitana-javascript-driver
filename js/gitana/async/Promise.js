(function(window) {

  Gitana = window.Gitana;

  const then = function(happy, sad) {
    this.push(happy, sad);
  };

  const success = function(happy) {
    then.call(this, happy);
  };

  const fail = function(sad) {
    then.call(this, undefined, sad);
  };

  const complete = function(cb) {
    then.call(this, cb, cb);
  };

  const Promise = function(defer) {

    this.then     = then.bind(defer);
    this.success  = success.bind(defer);
    this.fail     = fail.bind(defer);
    this.complete = complete.bind(defer);

    this.status  = function() {
      return defer.status;
    };

  };

  Promise.resolved = function(val) {
    const def = new Gitana.Defer();
    def.resolve(val);
    return def.promise;
  };

  Gitana.Promise = Promise;

})(window);
