(function(window) {

  // retry infinite is hard coded atm

  var Gitana = window.Gitana;

  var OBJECTS_PER_REQUEST = 50;

  var todos = {  };

  /**
   * Given a transaction add all of the tasks and then commit.
   */
  var commit = function(transaction) {
    var t        = todos[transaction.getId()];
    var requests = [];
    for (var i = t.length - 1; i >= 0; i--) {
      var cur = t.slice(0, OBJECTS_PER_REQUEST);
      var def = new Gitana.Defer();
      transaction.getDriver().gitanaPost('/transactions/' + transaction.getId() + '/add', {}, cur, function(res) {
        def.resolve(res);
      }, function(err) {
        t.concat(cur);
        commit(transaction).then(def.resolve, def.reject);
      });
      requests.push(def.promise);
    };
    return Gitana.defer.all(requests);
  };

  /**
   * Tell the server to cancel this transaction
   */
  var cancel = function(transaction) {
    var def = new Gitana.Defer();
    transaction.getDriver().gitanaDelete('/transactions/' + transaction.getId(), {}, {}, def.resolve, def.reject);
    return def.promise;
  };

  /**
   * Add data to a transaction
   */
  var addData = function(transaction, data) {
    todos[transaction.getId()].push(data);
  };

  /**
   * Transaction constructor
   *
   * Options doesn't really do anything ATM
   *
   * transaction.promise is a promise that gets resolved/rejected once the http
   * request completes which creates the transaction on the server side.
   */
  var Transaction = function(container, options) {
    var self = this;
    var def  = new Gitana.Defer();

    this.callbacks = {
      complete: [],
      fail:     [],
      success:  []
    };

    this.getContainer = function() {
      return container;
    };

    this.getDriver().gitanaPost(this.getUri(), {}, {}, function(res) {
      self.getId                 = function() { return res._doc;                   };
      self.getContainerReference = function() { return res['container-reference']; };
      def.resolve(self);
    }, function(err) {
      def.reject(err);
    });
  };

  /**
   * Cloud CMS
   */

   /**
    * Return the driver instance of this transaction's container
    */
  Transaction.prototype.getDriver = function() {
    return this.getContainer().getDriver();
  };

  /**
   * Returns the uri used to create this transaction
   */
  Transaction.prototype.getUri = function() {
    return '/transactions?reference=' + this.getContainer().ref();
  };

  /**
   * Transaction API
   */

   /**
    * Add a write action to the transaction
    */
  Transaction.prototype.update = function(data) {
    this.promise.then(function(self) {
      if (Gitana.isArray(data)) {
        for (var i = data.length - 1; i >= 0; i--) {
          var d = data[i];
          addData(self, {
            header: {
              type: 'node',
              operation: 'write'
            },
            data: d
          });
        };
      } else {
        addData(self, {
          header: {
            type: 'node',
            operation: 'write'
          },
          data: data
        })
      }
    });
    return this;
  };
  Transaction.prototype.create = Transaction.prototype.update;

  /**
   * Add a delete action to the transaction
   */
  Transaction.prototype.del = function(data) {
    this.promise.then(function(self) {
      if (Gitana.isArray(data)) {
        for (var i = data.length - 1; i >= 0; i--) {
          var d = data[i];
          addData(self, {
            header: {
              type: 'node',
              operation: 'delete'
            },
            data: d
          });
        }
      } else {
        addData(self, {
          header: {
            type: 'node',
            operation: 'delete'
          },
          data: data
        })
      }
    });
    return this;
  };

  /**
   * Commit this transaction
   */
  Transaction.prototype.commit = function() {
    var def  = new Gitana.Defer();
    var self = this;
    this.promise.then(function(self) {
      commit(self).then(def.resolve, def.reject);
    });
    def.promise.then(function(res) {
      for (var i in self.callbacks.complete) {
        var cb = self.callbacks.complete[i];
        cb(res);
      }
      for (var i in self.callbacks.success) {
        var cb = self.callbacks.success[i];
        cb(res);
      }
    }, function() {
      for (var i in self.callbacks.complete) {
        var cb = self.callbacks.complete[i];
        cb(res);
      }
      for (var i in self.callbacks.fail) {
        var cb = self.callbacks.fail[i];
        cb(res);
      }
    });
    return def.promise;
  };

  /**
   * Cancel this transaction
   */
  Transaction.prototype.cancel = function() {
    var def = new Gitana.Defer();
    this.promise.then(function(self) {
      cancel(self).then(def.resolve, def.reject);
    });
    return def.promise;
  };

  /**
   * Callback management
   */

   /**
    * Add a callback for an event (complete, fail, or success)
    */
   Transaction.prototype.addCallback = function(type, cb) {
     this.callbacks[type].push(cb);
   };

   /**
    * Add a callback on complete
    */
   Transaction.prototype.complete = function(cb) {
     this.addCallback('complete', cb);
   };

  /**
   * Add a callback on fail
   */
  Transaction.prototype.fail = function(cb) {
    this.addCallback('fail', cb);
  };

  /**
   * Add a callback on success
   */
  Transaction.prototype.success = function(cb) {
    this.addCallback('success', cb);
  };

  /**
   * Exports
   */

  Gitana.Transaction = Transaction;

  Gitana.TypedIDConstants.TYPE_TRANSACTION = 'Transaction';

  Gitana.ObjectFactory.prototype.transaction = function(container, object) {
    return this.create(Gitana.Transaction, container, object);
  };

  var createTransaction = function(container) {
    return new Transaction(container, {

    });
  };

  Gitana.transactions = {};
  Gitana.transactions.create = Gitana.prototype.createTransaction = function(container) {
    return container ? createTransaction(container) : {
      "for": createTransaction
    };
  };

})(window);
