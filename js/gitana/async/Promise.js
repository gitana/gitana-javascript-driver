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

  var Promise = function(defer) {

    this.then    = then.bind(defer);
    this.success = success.bind(defer);
    this.fail    = fail.bind(defer);

    this.status  = function() {
      this.defer.status;
    };

  };

  Gitana.Promise = Promise;

})(window);
