(function(window) {

    // retry infinite is hard coded atm

    var Gitana = window.Gitana;

    var OBJECTS_PER_REQUEST = 250;

    var STATUS_POLL_INTERVAL = 1 * 1000; // 1 second

    var TRANSACTION_STATUS_FINISHED = 'FINISHED';

    var chunk = function(array, size) {
        var chunks = [];
        for (var i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    };

    /**
     * Given a transaction add all of the tasks and then commit.
     */
    var commit = function(transaction) {
        var allObjects = transaction.objects;
        var requests   = [];
        var q          = new Gitana.Queue();

        // split up into chunks of objects
        var chunks = chunk(allObjects, OBJECTS_PER_REQUEST);
        for (var i = chunks.length - 1; i >= 0; i--) {
            var objects = chunks[i];

            var payload = {
                "objects": objects
            };

            q.add(function() {
              var def = new Gitana.Defer();
              (function(def, objects, transaction) {

                  // TRANSACTION_TEST
                  if (Gitana.Transaction.testMode)
                  {
                      console.log("POST /transactions/" + transaction.getId() + "/add");
                      def.resolve(objects);
                  }
                  else
                  {
                      transaction.getDriver().gitanaPost('/transactions/' + transaction.getId() + '/add', {}, payload, function(res) {
                          def.resolve(objects);
                      }, function(err) {
                          allObjects.concat(objects);
                          commit(transaction).then(def.resolve, def.reject);
                      });
                  }

              }(def, objects, transaction));
              return def.promise;
            });
        }
        var def2 = new Gitana.Defer();
        q.go().then(function(reses) {

            // TRANSACTION_TEST
            if (Gitana.Transaction.testMode)
            {
                console.log("POST /transaction/" + transaction.getId() + "/commit");
                def2.resolve();
            }
            else
            {
                transaction.getDriver().gitanaPost('/transactions/' + transaction.getId() + '/commit', {}, {}, function(res) {
                    def2.resolve(res);
                }, def2.reject);
            }

        }, def2.reject);
        return def2.promise;
    };

    /**
     * Tell the server to cancel this transaction
     */
    var cancel = function(transaction) {
        var def = new Gitana.Defer();

        // TRANSACTION_TEST
        if (Gitana.Transaction.testMode)
        {
            console.log("DELETE /transactions/" + transaction.getId());
            def.resolve();
        }
        else
        {
            transaction.getDriver().gitanaDelete('/transactions/' + transaction.getId(), {}, {}, function(res) {
                def.resolve(res);
            }, function(err) {
                def.reject(err)
            });
        }

        return def.promise;
    };

    /**
     * Add an object to a transaction
     */
    var addObject = function(transaction, object) {
        if (object.data && Gitana.isString(object.data)) {
            object.data = {
                "_doc": object.data
            };
        }
        transaction.objects.push(object);
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
        // object queue
        this.objects = [];

        this.getContainer = function() {
            return container;
        };

        if (container) {
            this['for'](container);
        }
    };

    Transaction.prototype['for'] = function(container) {
        if (this.promise) {
            throw new Error('Container for transaction has already been set');
        }

        var self = this;
        var def  = new Gitana.Defer();

        this.promise = def.promise;

        this.getDriver().gitanaPost(this.getUri(), {}, {}, function(res) {
            self.getId                 = function() { return res._doc;                   };
            self.getContainerReference = function() { return res['container-reference']; };
            def.resolve(self);
        }, function(err) {
            console.error(err);
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
    Transaction.prototype.write = function(data) {
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
        this.promise.then(function(self) {
            if (Gitana.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    addObject(self, {
                        header: {
                            type: 'node',
                            operation: 'write'
                        },
                        data: d
                    });
                }
            } else {
                addObject(self, {
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
    Transaction.prototype.create = Transaction.prototype.update = Transaction.prototype.write;

    /**
     * Add a delete action to the transaction
     */
    Transaction.prototype.del = function(data) {
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
        this.promise.then(function(self) {
            if (Gitana.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    addObject(self, {
                        header: {
                            type: 'node',
                            operation: 'delete'
                        },
                        data: d
                    });
                }
            } else {
                addObject(self, {
                    header: {
                        type: 'node',
                        operation: 'delete'
                    },
                    data: data
                });
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
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
        this.promise.then(function(self) {
            commit(self).then(function() {
                (function pollLoop() {

                    // TRANSACTION_TEST
                    if (Transaction.testMode)
                    {
                        console.log("GET /transactions/" + self.getId() + "/status");
                        def.resolve();
                    }
                    else
                    {
                        self.getDriver().gitanaGet('/transactions/' + self.getId() + '/status', {}, {}, function(res) {
                            if (res.status === TRANSACTION_STATUS_FINISHED) {
                                def.resolve(res.results);
                            } else {
                                setTimeout(pollLoop, STATUS_POLL_INTERVAL);
                            }
                        }, def.reject)
                    }

                })();
            }, def.reject);
        });
        return def.promise;
    };

    /**
     * Cancel this transaction
     */
    Transaction.prototype.cancel = function() {
        var def = new Gitana.Defer();
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
        this.promise.then(function(self) {
            cancel(self).then(def.resolve, def.reject);
        });
        return def.promise;
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

    Gitana.transactions = function() {

        var r = {};

        r.create = function(container) {
            return container ? createTransaction(container) : {
                "for": createTransaction
            };
        };

        return r;
    };

})(window);
