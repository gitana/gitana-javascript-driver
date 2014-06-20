var Gitana = require('Gitana');

var RETRY_COUNT = 0;
var OBJECTS_PER_REQUEST = 20;

// Breaks up actions into chunks of size objectsPerRequest
var chunks = function() {
  var chunks = [];
  var array  = this.todos;
  var opr    = this.objectsPerRequest;
  for (var i = 0; i < array.length; i += opr) {
    chunks.push(array.slice(i, i + opr));
  }
  return chunks;
};

var Transaction = function(branch, options) {
  branch = typeof branch === 'string' : new Gitana.Branch(branch) : branch;

  this.retryCount = options.retryCount || RETRY_COUNT;

  this.successCallbacks  = options.success || [];
  this.failureCallbacks  = options.error   || [];

  this.objectsPerRequest = options.objectsPerRequest || OBJECTS_PER_REQUEST;

  this.todo = [];

  this.getBranch = function() {
    return branch;
  };
};

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
  var chunks = getChunks.bind(this)();
  for (var i in chunks) {
    var chunk = chunks[i];

  }
  return this;
};
