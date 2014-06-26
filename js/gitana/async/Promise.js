(function(window) {

  var Gitana = window.Gitana;

  var then = function(happy, sad) {
    this.push(happy, sad);
  };

  var success = function(happy) {
    then.call(this, happy);
  };

  var fail = function(sad) {
    then.call(this, undefined, sad);
  };

  var complete = function(cb) {
    then.call(this, cb, cb);
  };

  var Promise = function(defer) {

    this.then     = then.bind(defer);
    this.success  = success.bind(defer);
    this.fail     = fail.bind(defer);
    this.complete = complete.bind(defer);

    this.status  = function() {
      return defer.status;
    };

  };

  Gitana.Promise = Promise;

})(window);
