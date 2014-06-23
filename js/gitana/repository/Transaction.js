(function(window) {

  var Gitana = window.Gitana;

  var RETRY_COUNT         = 3;
  var OBJECTS_PER_REQUEST = 50;
  var SCOPE_TYPE_BRANCH   = 'branch';

  Gitana.TypedIDConstants.TYPE_TRANSACTION = 'Transaction';

  /**
   * AJAX request callbacks
   */
  var initSuccessCallback = function(result) {
    this.id = result.id;
    this.initialized = true;
  };

  var initErrorCallback = function() {
    throw new Error("Transaction creation failure");
  };

  var workSuccessCallback = function() {
    console.log(arguments);
  };

  var workErrorCallback = function() {

  };

  var cancelSuccessCallback = function() {

  };

  var cancelErrorCallback = function() {

  };

  var commitSuccessCallback = function() {

  };

  var commitErrorCallback = function() {

  };

  /**
   * Privileged functions
   */
  var addWork = function(transaction, work) {
    var driver = transaction.getDriver();
    driver.gitanaPost(transaction.getAssignUri(), {

    }, work, workSuccessCallback.bind(transaction), workErrorCallback.bind(this));
  };

  var cancel = function(transaction) {
    var driver = transaction.getDriver();
    driver.gitanaDelete(transaction.getCancelUri(), {

    }, work, cancelSuccessCallback.bind(transaction), cancelErrorCallback.bind(this));
  };

  var commit = function(transaction) {
    var driver = transaction.getDriver();
    driver.gitanaPost(transaction.getCommitUri(), {

    }, work, commitSuccessCallback.bind(transaction), commitErrorCallback.bind(this));
  };

  /**
   * Transaction class
   */
  var Transaction = function(scope, options) {
    this.todo              = [];
    this.retryCount        = options.retryCount        || RETRY_COUNT;
    this.successCallbacks  = options.success           || [];
    this.failureCallbacks  = options.error             || [];
    this.objectsPerRequest = options.objectsPerRequest || OBJECTS_PER_REQUEST;

    this.getScope = function() {
      return scope;
    };

    var driver = this.getDriver();
    driver.gitanaPost(this.getUri(), {  }, {  }, initSuccessCallback.bind(this), initErrorCallback.bind(this));
  };

  /**
   * URI Getters
   */
  Transaction.prototype.getUri = function() {
    return '/bulk/transactions?scope=' + this.getScopeType() + '://' + this.getScopePath();
  };

  Transaction.prototype.getCreateUri = function() {
    return this.getUri();
  };

  Transaction.prototype.getAssignUri = function() {
    return '/bulk/transactions/' + this.getId() + '/assign';
  };

  Transaction.prototype.getCancelUri = function() {
    return '/bulk/transactions/' + this.getId();
  };

  Transaction.prototype.getCommitUri = function() {
    return '/bulk/transactions/' + this.getId(); + '/commit';
  };

  /**
   * Cloud CMS
   */
  Transaction.prototype.getDriver = function() {
    return this.getScope().getDriver();
  };

  Transaction.prototype.getScopeType = function() {
    var scope = this.getScope();
    if (scope instanceof Gitana.Branch) { return SCOPE_TYPE_BRANCH; }
  };

  Transaction.prototype.getScopePath = function() {
    var scope = this.getScope();
    var scopeType = this.getScopeType();
    if (scopeType === SCOPE_TYPE_BRANCH) {
      return [
        scope.getPlatformId(),
        scope.getRepositoryId(),
        scope.getId()
      ].join('/');
    }
  }

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

  /**
   * Client API
   */
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

  Transaction.prototype.cancel = function() {

  };

  /**
   * Exposing functions to create transactions
   */
  Gitana.Transaction = Transaction;

  Gitana.ObjectFactory.prototype.transaction = function(scope, object) {
    return this.create(Gitana.Transaction, scope, object);
  };

  var createTransaction = function(scope) {
    return new Transaction(scope, {

    });
  };

  Gitana.createTransaction = Gitana.prototype.createTransaction = function(scope) {
    return scope ? createTransaction(scope) : {
      for: createTransaction
    };
  };

  Gitana.Branch.prototype.createTransaction = function() {
    return createTransaction(this);
  };

})(window);
