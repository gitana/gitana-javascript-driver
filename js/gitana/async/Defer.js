(function(window) {

  var Gitana = window.Gitana;

  var STATUS_UNRESOLVED = 'unresolved';
  var STATUS_RESOLVED   = 'resolved';
  var STATUS_REJECTED   = 'rejected';

  var triggerAll = function(val, cbs)  {
    for (var i = 0; i < cbs.length; i++) {
      var cb = cbs[i];
      trigger(val, cb);
    }
  };

  var trigger = function(val, cb) {
    setTimeout(cb.bind(null, val), 0);
  };

  var resolve = function(val) {
    if (this.isUnresolved()) {
      this.status = STATUS_RESOLVED;
      this.val = val;
      triggerAll(val, this.successCallbacks);
      delete this.successCallbacks;
      delete this.errorCallbacks;
    }
  };

  var reject = function(err) {
    if (this.isUnresolved()) {
      this.status = STATUS_REJECTED;
      this.val = err;
      triggerAll(err, this.errorCallbacks);
      delete this.successCallbacks;
      delete this.errorCallbacks;
    }
  };

  var Defer = function() {
    this.promise = new Gitana.Promise(this);

    this.status = STATUS_UNRESOLVED;

    this.successCallbacks = [];
    this.errorCallbacks   = [];

    this.resolve = resolve.bind(this);
    this.reject  = reject.bind(this);
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
    if (args === undefined) {
      return Gitana.Promise.resolved();
    }
    if (!Gitana.isArray(args)) { args = arguments; }
    var def     = new Defer();
    var left    = args.length;
    var results = [];
    for (var i = 0; i < args.length; i++) {
      var promise = args[i];
      (function(cur) {
        promise.then(function(res) {
          left--;
          results[cur] = res;
          if (left <= 0) {
            def.resolve(results);
          }
        }, def.reject);
      })(i);
    }
    return def.promise;
  };

  Gitana.Defer = Defer;

})(window);
