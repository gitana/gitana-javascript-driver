(function(window) {

  var RETRY_COUNT         = 3;
  var OBJECTS_PER_REQUEST = 50;

  var Gitana = window.Gitana;

  Gitana.TypedIDConstants.TYPE_TRANSACTION = 'Transaction';

  var parent = Gitana.AbstractPlatformObject.prototype;

  var Transaction = function(branch, object) {
    parent.constructor.call(this, branch.getrepository().getPlatform(), object);

    this.todo              = [];
    this.retryCount        = options.retryCount        || RETRY_COUNT;
    this.successCallbacks  = options.success           || [];
    this.failureCallbacks  = options.error             || [];
    this.objectsPerRequest = options.objectsPerRequest || OBJECTS_PER_REQUEST;

    this.getBranch = function() {
      return branch;
    };

    this.getRepository = function() {
      return branch.getRepository();
    };
  };

  Transaction.prototype = {
    prototype: parent
  };

  // Cloud CMS

  Transaction.prototype.objectType = function() {
    return 'Gitana.Transaction';
  };

  Transaction.prototype.getBranchId = function() {
    return this.getBranch().getId();
  };

  Transaction.prototype.getRepositoryId = function() {
    return this.getRepository().getId();
  };

  Transaction.prototype.getType = function() {
    return Gitana.TypedIDConstants.TYPE_TRANSACTION;
  };

  Transaction.prototype.getUri = function() {
    return '/transactions/' + this.getId();
  };

  // Transaction API

  Transaction.prototype.insert = function(nodes) {
    this.todo.push({
      action: 'insert',
      data:   nodes
    });
    return this;
  };

  Transaction.prototype.remove = function(node) {
    this.todo.push({
      action: 'remove',
      data:   typeof node === 'string' ? { _doc: node } : node
    });
    return this;
  };

  // what does this do?
  Transaction.prototype.read = function(id) {
    return this;
  };

  Transaction.prototype.retryCount = function(n) {
    if (typeof n === 'number') {
      this.retryCount = n;
    }
    return this;
  };

  Transaction.prototype.fail = function(cb) {
    if (typeof cb === 'function') {
      this.failureCallbacks.push(cb);
    }
    return this;
  };

  Transaction.prototype.success = function(cb) {
    if (typeof cb === 'function') {
      this.successCallbacks.push(cb);
    }
    return this;
  };

  Transaction.prototype.commit = function(cb) {
    return this;
  };

  // Exposed functions for creating transactions

  Gitana.Transaction = Transaction;

  Gitana.ObjectFactory.prototype.transaction = function(branch, object) {
    return this.create(Gitana.Transaction, branch, object);
  };

  var createTransaction = function(branch) {
    return new Transaction(branch, {

    });
  };

  Gitana.prototype.createTransaction = function(branch) {
    return branch ? createTransaction(branch) : {
      for: createTransaction
    };
  };

  Gitana.Branch.prototype.createTransaction = function() {
    return createTransaction(this);
  };

})(window);
