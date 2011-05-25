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
         * @param {Gitana.Server} server
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            if (!this.map)
            {
                this.map = {};
            }
            if (!this.keys)
            {
                this.keys = [];
            }

            this.base(server, object);
        },

        clear: function()
        {
            // empty the map
            for (var i in this.map) {
                if (this.map.hasOwnProperty(i)) {
                    delete this.map[i];
                }
            }

            // NOTE: we can't use slice(0,0) to do this since that hands back a NEW array!
            // we need the keys and map variables to remain on the non-proxied subobject
            // if we create a new array, they get pushed up to top-scope object
            // empty the keys
            while (this.keys.length > 0)
            {
                this.keys.shift();
            }
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
            this.base(response);

            this.clear();

            if (response)
            {
                // parse array
                if (Gitana.isArray(response.rows))
                {
                    for (var i = 0; i < response.rows.length; i++)
                    {
                        var o = this.buildObject(response.rows[i]);
                        this.map[o.getId()] = o;

                        this.keys.push(o.getId());
                    }
                }
                else
                {
                    // parse object

                    for (var key in response.rows)
                    {
                        var value = response.rows[key];

                        var o = this.buildObject(value);
                        this.map[o.getId()] = o;

                        this.keys.push(o.getId());
                    }
                }
            }

            //this.object = response;
        },

        /**
         * @abstract
         * ABSTRACT METHOD
         *
         * @param json
         */
        buildObject: function(json)
        {

        },

        get: function(key)
        {
            return this.map[key];
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
                for (var i = 0; i < this.keys.length; i++)
                {
                    // key and value from the map
                    var key = this.keys[i];
                    var value = this.map[key];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key, index)
                    {
                        return function()
                        {
                            callback.call(this, key, this, index);
                        };

                    }(callback, key, i);

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
                for (var i = 0; i < this.keys.length; i++)
                {
                    var key = this.keys[i];
                    var value = this.map[key];

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
                return this.then(functions)

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

                for (var i = 0; i < this.keys.length; i++)
                {
                    var key = this.keys[i];
                    var object = this.map[key];

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
                    delete this.map[keysToRemove[i]];
                }

                // swap keys to keep
                // NOTE: we first clear the keys but we can't use slice(0,0) since that produces a NEW array
                // instead, do this shift trick
                while (this.keys.length > 0)
                {
                    this.keys.shift();
                }
                for (var k in keysToKeep)
                {
                    this.keys.push(keysToKeep[k]);
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

                this.keys.sort(comparator);

            });
        },

        /**
         * Keeps only the given number of elements in the map.
         *
         * @chained
         *
         * @param size
         */
        keep: function(size)
        {
            return this.then(function() {

                var keysToRemove = [];

                if (size > this.keys.length)
                {
                    // keep everything
                    return;
                }

                // figure out which keys to remove
                for (var i = 0; i < this.keys.length; i++)
                {
                    if (i >= size)
                    {
                        keysToRemove.push(this.keys[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.keys.length > size)
                {
                    this.keys.pop();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }
            });
        },

        /**
         * Counts the number of elements in the map and stores it as a response for future then() calls.
         */
        count: function(callback)
        {
            return this.then(function() {
                callback.call(this, this.keys.length);
            });
        }

    });

})(window);
