(function(window) {

  var Gitana = window.Gitana;

  var STATUS_UNRESOLVED = 'unresolved';
  var STATUS_RESOLVED   = 'resolved';
  var STATUS_REJECTED   = 'rejected';

  var triggerAll = function(val, cbs)  {
    for (var i = cbs.length - 1; i >= 0; i--) {
      var cb = cbs[i];
      trigger(val, cb);
    };
  };

  var trigger = function(val, cb) {
    setTimeout(cb.bind(null, val), 0);
  };

  var Defer = function() {
    this.promise = new Gitana.Promise();

    this.status = STATUS_UNRESOLVED;

    this.successCallbacks = [];
    this.errorCallbacks   = [];
  };

  Defer.prototype.resolve = function(val) {
    if (this.isUnresolved()) {
      this.val = val;
      triggerAll(val, this.successCallbacks);
      delete this.successCallbacks;
      delete this.errorCallbacks;
    }
  };

  Defer.prototype.reject = function(err) {
    if (this.isUnresolved()) {
      this.val = err;
      triggerAll(err, this.errorCallbacks);
      delete this.successCallbacks;
      delete this.errorCallbacks;
    }
  };

  Defer.prototype.push = function(happy, sad) {
    if (this.isUnresolved()) {
      if (typeof happy === 'function') { this.successCallbacks.push(happy); }
      if (typeof sad   === 'function') { this.errorCallbacks.push(sad);     }
    } else if (this.isResolved()) {
      trigger(this.val, happy);
    } else if (this.isRejected()) {
      trigger(this.val, sad);
    }
  };

  Defer.prototype.isUnresolved = function() {
    return this.status === STATUS_UNRESOLVED;
  };

  Defer.prototype.isResolved = function() {
    return this.status === STATUS_RESOLVED;
  };

  Defer.prototype.isRejected = function() {
    return this.status === STATUS_REJECTED;
  };

  Defer.all = function(args) {
    if (!Gitana.isArray(args)) { args = arguments; }
    var def     = new Defer();
    var left    = args.length;
    var results = [];
    for (var i = args.length - 1; i >= 0; i--) {
      var cur     = i;
      var promise = args[i];
      promise.then(function(res) {
        left--;
        results[cur] = res;
        if (left <= 0) {
          def.resolve(results);
        }
      }, def.reject);
    }
    return defer.promise;
  };

  Gitana.Defer = Defer;

})(window);
