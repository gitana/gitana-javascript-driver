(function(window) {

    // retry infinite is hard coded atm

    var Gitana = window.Gitana;

    var OBJECTS_PER_REQUEST = 50;

    var chunk = function(array, size) {
        var chunks = [];
        for (var i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, size));
        }
        return chunks;
    };

    /**
     * Given a transaction add all of the tasks and then commit.
     */
    var commit = function(transaction) {
        var allObjects = transaction.objects;
        var requests = [];

        // split up into chunks of objects
        var chunks = chunk(allObjects, OBJECTS_PER_REQUEST);
        for (var i = chunks.length - 1; i >= 0; i--) {
            var objects = chunks[i];

            var payload = {
                "objects": objects
            };

            var def = new Gitana.Defer();

            // wrap in a closure
            (function(def, objects, transaction) {
                transaction.getDriver().gitanaPost('/transactions/' + transaction.getId() + '/add', {}, payload, function(res) {
                    def.resolve(objects);
                }, function(err) {
                    allObjects.concat(objects);
                    commit(transaction).then(def.resolve, def.reject);
                });
            }(def, objects, transaction));

            requests.push(def.promise);
        }
        var def2 = new Gitana.Defer();
        Gitana.Defer.all(requests).then(function(reses) {
            transaction.getDriver().gitanaPost('/transactions/' + transaction.getId() + '/commit', {}, {}, function(res) {
                def2.resolve(res);
            }, def2.reject);
        }, def2.reject);
        return def2.promise;
    };

    /**
     * Tell the server to cancel this transaction
     */
    var cancel = function(transaction) {
        var def = new Gitana.Defer();
        transaction.getDriver().gitanaDelete('/transactions/' + transaction.getId(), {}, {}, function(res) {
            def.resolve(res);
        }, function(err) {
            def.reject(err)
        });
        return def.promise;
    };

    /**
     * Add data to a transaction
     */
    var addData = function(transaction, data) {
        transaction.objects.push(data);
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
    Transaction.prototype.update = function(data) {
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
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
                }
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
        if (typeof this.promise === 'undefined') {
            throw new Error('You must set the transaction\'s container with the "for" method before calling this method' );
        }
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
            commit(self).then(def.resolve, def.reject);
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