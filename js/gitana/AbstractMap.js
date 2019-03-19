(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractMap = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.AbstractMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Abstract base class for a map of Gitana objects
         *
         * @param {Gitana} driver
         * @param [Object] object
         */
        constructor: function(driver, object)
        {
            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            // auto-manage a list of keys
            this.__keys = (function() {
                var list = [];
                return function(x) {
                    if (!Gitana.isUndefined(x)) {
                        if (x == 'empty') {
                            while (list.length > 0) { list.shift(); }
                        } else {
                            if (!x && x.length) {
                                for (var i = 0; i < x.length; i++) {
                                    list.push(x[i]);
                                }
                            }
                            else
                            {
                                list.push(x);
                            }
                        }
                    }
                    return list;
                };
            })();

            this.__totalRows = (function() {
                var _totalRows = null;
                return function(totalRows) {
                    if (!Gitana.isUndefined(totalRows)) { _totalRows = totalRows; }
                    return _totalRows;
                };
            })();

            this.__size = (function() {
                var _size = null;
                return function(size) {
                    if (!Gitana.isUndefined(size)) { _size = size; }
                    return _size;
                };
            })();

            this.__offset = (function() {
                var _offset = 0;
                return function(offset) {
                    if (!Gitana.isUndefined(offset) && offset >= 0) { _offset = offset; }
                    return _offset;
                };
            })();

            this.base(driver, object);

            // in case the incoming object is a state-carrying object (like another map)
            if (object)
            {
                this.chainCopyState(object);
            }
        },

        refs: function()
        {
            var references = [];

            for (var i = 0; i < this.__keys().length; i++)
            {
                var key = this.__keys()[i];

                var object = this[key];
                if (object.ref)
                {
                    references.push(object.ref());
                }
            }

            return references;
        },

        /**
         * Override to include:
         *
         *   __keys
         *   __totalRows
         *   __size
         *   __offset
         *
         * @param otherObject
         */
        chainCopyState: function(otherObject)
        {
            this.base(otherObject);

            // include keys
            if (otherObject.__keys) {
                this.__keys('empty');
                for (var i = 0; i < otherObject.__keys().length; i++)
                {
                    var k = otherObject.__keys()[i];
                    this.__keys().push(k);
                }
            }

            if (otherObject.__totalRows) {
                this.__totalRows(otherObject.__totalRows());
            }
            if (otherObject.__size) {
                this.__size(otherObject.__size());
            }
            if (otherObject.__offset) {
                this.__offset(otherObject.__offset());
            }

        },

        clear: function()
        {
            // clear object properties (but not member functions)
            Gitana.deleteProperties(this, false);

            // empty keys
            this.__keys('empty');
        },

        /**
         * @override
         *
         * Convert the json response object into the things we want to preserve on the object.
         * This should set the "object" property but may choose to set other properties as well.
         *
         * @param response
         */
        handleResponse: function(response)
        {
            this.clear();

            if (response)
            {
                // is it a gitana map?
                if (response.totalRows && response.size && response.offset) {
                    this.__totalRows(response.totalRows());
                    this.__size(response.size());
                    this.__offset(response.offset());
                }
                else
                {
                    // otherwise assume it is a gitana result set
                    this.__totalRows(response["total_rows"]);
                    this.__size(response["size"]);
                    this.__offset(response["offset"]);
                }

                if (response.rows)
                {
                    // parse array
                    if (Gitana.isArray(response.rows))
                    {
                        for (var i = 0; i < response.rows.length; i++)
                        {
                            var o = this.buildObject(response.rows[i]);
                            this[o.getId()] = o;

                            this.__keys().push(o.getId());
                        }
                    }
                    else
                    {
                        // parse object
                        for (var key in response.rows)
                        {
                            if (response.rows.hasOwnProperty(key) && !Gitana.isFunction(response.rows[key]))
                            {
                                var value = response.rows[key];

                                var o = this.buildObject(value);

                                // determine key
                                var k = (o.getId && o.getId());
                                if (!k) {
                                    k = key;
                                }
                                this[k] = o;

                                this.__keys().push(k);
                            }
                        }
                    }
                    this.__size(this.__keys().length);
                }
                else
                {
                    // otherwise, assume it is key/value pairs
                    // it also might be another Gitana Map

                    for (var key in response)
                    {
                        if (response.hasOwnProperty(key) && !Gitana.isFunction(response[key]))
                        {
                            var value = response[key];

                            var o = this.buildObject(value);

                            // determine key
                            var k = (o.getId && o.getId());
                            if (!k) {
                                k = key;
                            }
                            this[k] = o;

                            this[k] = o;

                            this.__keys().push(k);
                        }
                    }
                    this.__size(this.__keys().length);
                }
            }
        },

        /**
         * @abstract
         *
         * @param json
         */
        buildObject: function(json)
        {

        },

        get: function(key)
        {
            return this[key];
        },

        asArray: function()
        {
            var array = [];
            for (var i = 0; i < this.__keys().length; i++)
            {
                var k = this.__keys()[i];

                array.push(this[k]);
            }

            return array;
        },

        size: function(callback)
        {
            if (callback)
            {
                return this.then(function() {
                    callback.call(this, this.__size());
                });
            }

            return this.__size();
        },

        offset: function(callback)
        {
            if (callback)
            {
                return this.then(function() {
                    callback.call(this, this.__offset());
                });
            }

            return this.__offset();
        },

        totalRows: function(callback)
        {
            if (callback)
            {
                return this.then(function() {
                    callback.call(this, this.__totalRows());
                });
            }

            return this.__totalRows();
        },


        /**
         * Iterates over the map and fires the callback function in SERIAL for each element in the map.
         * The scope for the callback is the object from the map (i.e. repository object, node object).
         *
         * The arguments to the callback function are (key, value) where value is the same as "this".
         *
         * NOTE: This works against elements in the map in SERIAL.  One at a time.  If you are doing concurrent
         * remote operations for members of the set such that each operation is independent, you may want to use
         * the eachX() method.
         *
         * @chained this
         *
         * @param callback
         */
        each: function(callback)
        {
            return this.then(function() {

                // run functions
                for (var i = 0; i < this.__keys().length; i++)
                {
                    // key and value from the map
                    var key = this.__keys()[i];
                    var value = this[key];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key, index, map)
                    {
                        return function()
                        {
                            callback.call(this, key, this, index);

                            // manually copy resulting value back
                            Gitana.deleteProperties(map[key]);
                            Gitana.copyInto(map[key], this);
                        };

                    }(callback, key, i, this);

                    // create subchain mounted on this chainable and the run function
                    this.subchain(value).then(f);
                }

                return this;
            });
        },

        /**
         * Iterates over the map and fires the callback function in PARALLEL for each element in the map.
         * The scope for the callback is the object from the map (i.e. repository object, node object).
         *
         * The arguments to the callback function are (key, value) where value is the same as "this".
         *
         * NOTE: This works against elements in the map in PARALLEL.  All map members are fired against at the same
         * time on separate timeouts.  There is no guaranteed order for their completion.  If you require serial
         * execution, use the each() method.
         *
         * @chained
         *
         * @param callback
         */
        eachX: function(callback)
        {
            return this.then(function() {

                // create an array of functions that invokes the callback for each element in the array
                var functions = [];
                for (var i = 0; i < this.__keys().length; i++)
                {
                    var key = this.__keys()[i];
                    var value = this[key];

                    var f = function(callback, key, value, index) {

                        return function()
                        {
                            // NOTE: we're running a parallel chain that is managed for us by the Chain then() method.
                            // we can't change the parallel chain but we can subchain from it
                            // in our subchain we run our method
                            // the parallel chain kind of acts like one-hop noop so that we can take over and do our thing
                            this.subchain(value).then(function() {
                                callback.call(this, key, this, index);
                            });
                        };

                    }(callback, key, value, i);

                    functions.push(f);
                }

                // kick off all these functions in parallel
                // adding them to the subchain
                return this.then(functions);
            });
        },

        /**
         * Iterates over the map and applies the callback filter function to each element.
         * It should hand back true if it wants to keep the value and false to remove it.
         *
         * NOTE: the "this" for the callback is the object from the map.
         *
         * @chained
         *
         * @param callback
         */
        filter: function(callback)
        {
            return this.then(function() {

                var keysToKeep = [];
                var keysToRemove = [];

                for (var i = 0; i < this.__keys().length; i++)
                {
                    var key = this.__keys()[i];
                    var object = this[key];

                    var keepIt = callback.call(object);
                    if (keepIt)
                    {
                        keysToKeep.push(key);
                    }
                    else
                    {
                        keysToRemove.push(key);
                    }
                }

                // remove any keys we don't want from the map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this[keysToRemove[i]];
                }

                // swap keys to keep
                // NOTE: we first clear the keys but we can't use slice(0,0) since that produces a NEW array
                // instead, do this shift trick
                this.__keys('empty');
                for (var i = 0; i < keysToKeep.length; i++)
                {
                    this.__keys().push(keysToKeep[i]);
                }
            });
        },

        /**
         * Applies a comparator to sort the map.
         *
         * If no comparator is applied, the map will be sorted by its modification timestamp (if possible).
         *
         * The comparator can be a string that uses dot-notation to identify a field in the JSON that
         * should be sorted.  (example: "title" or "property1.property2.property3")
         *
         * Finally, the comparator can be a function.  It takes (previousValue, currentValue) and hands back:
         *   -1 if the currentValue is less than the previousValue (should be sorted lower)
         *   0 if they are equivalent
         *   1 if they currentValue is greater than the previousValue (should be sorted higher)
         *
         * @chained
         *
         * @param comparator
         */
        sort: function(comparator)
        {
            return this.then(function() {

                // build a temporary array of values
                var array = [];
                for (var i = 0; i < this.__keys().length; i++) {
                    var key = this.__keys()[i];
                    array.push(this[key]);
                }

                // sort the array
                array.sort(comparator);

                // now reset keys according to the order of the array
                this.__keys("empty");
                for (var i = 0; i < array.length; i++)
                {
                    this.__keys().push(array[i].getId());
                }

            });
        },

        /**
         * Limits the number of elements in the map.
         *
         * @chained
         *
         * @param size
         */
        limit: function(size)
        {
            return this.then(function() {

                var keysToRemove = [];

                if (size > this.__keys().length)
                {
                    // keep everything
                    return;
                }

                // figure out which keys to remove
                for (var i = 0; i < this.__keys().length; i++)
                {
                    if (i >= size)
                    {
                        keysToRemove.push(this.__keys()[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.__keys().length > size)
                {
                    this.__keys().pop();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this[keysToRemove[i]];
                }

                // reset the size
                this.__size(this.__keys().length);
            });
        },

        /**
         * Paginates elements in the map.
         *
         * @chained
         *
         * @param pagination
         */
        paginate: function(pagination)
        {
            return this.then(function() {

                var skip = pagination.skip;
                var limit = pagination.limit;

                var keysToRemove = [];

                // figure out which keys to remove
                for (var i = 0; i < this.__keys().length; i++)
                {
                    if (i < skip || i >= skip + limit)
                    {
                        keysToRemove.push(this.__keys()[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.__keys().length > limit + skip)
                {
                    this.__keys().pop();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this[keysToRemove[i]];
                }

                // reset the limit
                this.__size(this.__keys().length);
            });
        },

        /**
         * Counts the number of elements in the map and fires it into a callback function.
         */
        count: function(callback)
        {
            if (callback)
            {
                return this.then(function() {
                    callback.call(this, this.__keys().length);
                });
            }

            return this.__keys().length;
        },

        /**
         * Keeps the first element in the map
         */
        keepOne: function(emptyHandler)
        {
            var self = this;

            var json = {};
            if (this.__keys().length > 0)
            {
                json = this[this.__keys()[0]];
            }

            var chainable = this.buildObject(json);

            return this.subchain(chainable).then(function() {

                var chain = this;

                this.subchain(self).then(function() {

                    if (this.__keys().length > 0)
                    {
                        var obj = this[this.__keys()[0]];

                        if (chain.loadFrom)
                        {
                            // for objects, like nodes or branches
                            chain.loadFrom(obj);
                        }
                        else
                        {
                            // non-objects? (i.e. binary or attachment maps)
                            chain.handleResponse(obj);
                        }
                    }
                    else
                    {
                        var err = new Gitana.Error();
                        err.name = "Empty Map";
                        err.message = "The map doesn't have any elements in it";

                        if (emptyHandler)
                        {
                            emptyHandler.call(self, err);
                        }
                        else
                        {
                            this.error(err);
                        }

                        return false;
                    }

                });
            });
        },

        /**
         * Selects an individual element from the map and continues the chain.
         *
         * @param key
         */
        select: function(key)
        {
            var self = this;

            var json = {};
            if (this[key])
            {
                json = this[key];
            }

            // what we hand back
            var result = this.subchain(this.buildObject(json));

            // preload some work
            return result.then(function() {

                var chain = this;

                this.subchain(self).then(function() {

                    var obj = this[key];
                    if (!obj)
                    {
                        var err = new Gitana.Error();
                        err.name = "No element with key: " + key;
                        err.message = err.name;

                        this.error(err);

                        return false;
                    }

                    if (result.loadFrom)
                    {
                        // for objects, like nodes or branches
                        chain.loadFrom(obj);
                    }
                    else
                    {
                        // non-objects? (i.e. binary or attachment maps)
                        chain.handleResponse(obj);
                    }

                });
            });
        }

    });

})(window);
