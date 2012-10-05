(function(window)
{
    /**
     * Creates a chain.  If an object is provided, the chain is augmented onto the object.
     *
     * @param object
     */
    Chain = function(object)
    {
        /*
        var generateId = function()
        {
            if (!Chain.idCount)
            {
                Chain.idCount = 0;
            }

            return "chain-" + Chain.idCount++;
        };
        */

        if (!object)
        {
            object = {};
        }

        // wraps the object into a proxy
        var proxiedObject = Chain.proxy(object);

        // the following methods get pushed onto the chained object
        // methods for managing chain state
        proxiedObject.__queue = (function() {
            var queue = [];
            return function(x) {
                if (x) { if (x == 'empty') { queue = []; } else { queue.push(x); }}
                return queue;
            };
        })();
        proxiedObject.__response = (function() {
            var response = null;
            return function(x) {
                if (!Gitana.isUndefined(x)) { if (x) { response = x; } else { response = null; } }
                return response;
            }
        })();
        proxiedObject.__waiting = (function() {
            var waiting = false;
            return function(x) {
                if (!Gitana.isUndefined(x)) { waiting = x; }
                return waiting;
            }
        })();
        /*
        proxiedObject.__id = (function() {
            var id = generateId();
            return function() {
                return id;
            }
        })();
        */
        proxiedObject.__parent = (function() {
            var parent = null;
            return function(x) {
                if (!Gitana.isUndefined(x)) { if (x) { parent = x; } else { parent = null; } }
                return parent;
            }
        })();


        /**
         * Queues either a callback function, an array of callback functions or a subchain.
         *
         * @param element
         */
        proxiedObject.then = function(element)
        {
            var self = this;

            var autorun = false;

            //
            // ARRAY
            //
            // if we're given an array of functions, we'll automatically build out a function that orchestrates
            // the concurrent execution of parallel chains.
            //
            // the function will be pushed onto the queue
            //
            if (Gitana.isArray(element))
            {
                var array = element;

                // parallel function invoker
                var parallelInvoker = function()
                {
                    // counter and onComplete() method to keep track of our parallel thread completion
                    var count = 0;
                    var total = array.length;
                    var onComplete = function()
                    {
                        count++;
                        if (count == total)
                        {
                            // manually signal that we're done
                            self.next();
                        }
                    };

                    for (var i = 0; i < array.length; i++)
                    {
                        var func = array[i];

                        // use a closure
                        var x = function(func)
                        {
                            // each function gets loaded onto its own "parallel" chain
                            // the parallel chain contains a subchain and the onComplete method
                            // the parallel chain is a clone of this chain
                            // the subchain runs the function
                            // these are serial so that the subchain must complete before the onComplete method is called
                            var parallelChain = Chain(); // note: empty chain (parent)
                            parallelChain.__waiting(true); // this prevents auto-run (which would ground out the first subchain call)
                            parallelChain.subchain(self).then(function() { // TODO: should we self.clone() for parallel operations?
                                func.call(this);
                            });
                            parallelChain.then(function() {
                                onComplete();
                            });
                            parallelChain.__waiting(false); // switch back to normal
                            parallelChain.run();
                        };
                        x(func);
                    }

                    // return false so that we wait for manual self.next() signal
                    return false;
                };

                // build a subchain
                var subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.__queue(parallelInvoker);
                element = subchain;
            }

            //
            // FUNCTION
            //
            // if we're given a function, then we're being asked to execute a function serially.
            // to facilitate this, we'll wrap it in a subchain and push the subchain down into the queue.
            // the reason is just to make things a little easier and predictive of what the end user might do with
            // the chain.  they probably don't expect it to just exit out if they try to to
            //   this.then(something)
            // in other words, they should always feel like they have their own chain (which in fact they do)
            else if (Gitana.isFunction(element))
            {
                // create the subchain
                // this does a re-entrant call that adds it to the queue (as a subchain)
                var subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.__queue(element);
                element = subchain;

                // note: because we're given a function, we can tell this chain to try to "autorun"
                autorun = true;
            }


            // anything that arrives this far is just a subchain
            this.__queue(element);


            // if we're able to autorun (meaning that we were told to then() a function)...
            // we climb the parents until we find the topmost parent and tell it to run.
            if (autorun && !this.__waiting())
            {
                var runner = this;
                while (runner.__parent())
                {
                    runner = runner.__parent()
                }

                if (!runner.__waiting())
                {
                    runner.run();
                }
            }

            // always hand back reference to ourselves
            return this;
        };

        /**
         * Run the next element in the queue
         */
        proxiedObject.run = function()
        {
            var self = this;

            // short cut, if nothing in the queue, bail
            if (this.__queue().length == 0 || this.__waiting())
            {
                return this;
            }

            // mark that we're running something
            this.__waiting(true);

            // the element to run
            var element = this.__queue().shift();

            // case: callback function
            if (Gitana.isFunction(element))
            {
                // it's a callback function
                var callback = element;

                // try to determine response and previous response
                var response = null;
                var previousResponse = null;
                if (this.__parent())
                {
                    response = this.__parent().__response();
                    if (this.__parent().__parent())
                    {
                        previousResponse = this.__parent().__parent().__response();
                    }
                }

                // async
                window.setTimeout(function()
                {
                    // execute with "this = chain"
                    var returned = callback.call(self, response, previousResponse);
                    if (returned !== false)
                    {
                        self.next(returned);
                    }
                }, 0);
            }
            else
            {
                // it's a subchain element (object)
                // tell it to run
                var subchain = element;
                subchain.__response(this.__response()); // copy response down into it first
                if (subchain.beforeChainRun)
                {
                    subchain.beforeChainRun.call(subchain);
                }
                subchain.run();
            }

            return this;
        };

        /**
         * Creates a subchain and adds it to the queue.
         *
         * If no argument is provided, the generated subchain will be cloned from the current chain element.
         */
        proxiedObject.subchain = function(object, noAutoAdd)
        {
            if (!object)
            {
                object = this;
            }

            var subchain = Chain(object);
            subchain.__parent(this);

            if (subchain.beforeChainRun)
            {
                subchain.beforeChainRun.call(subchain);
            }

            if (!noAutoAdd)
            {
                this.then(subchain)
            }

            return subchain;
        };

        /**
         * Completes the current element in the chain and provides the response that was generated.
         *
         * The response is pushed into the chain as the current response and the current response is bumped
         * back as the previous response.
         *
         * If the response is null, nothing will be bumped.
         *
         * @param [Object] response
         */
        proxiedObject.next = function(response)
        {
            // toggle responses
            if (typeof response !== "undefined")
            {
                this.__response(response);
            }

            // no longer processing callback
            this.__waiting(false);

            // if there isn't anything left in the queue, then we're done
            // if we have a parent, we can signal that we've completed
            if (this.__queue().length == 0)
            {
                if (this.__parent())
                {
                    // copy response up to parent
                    var r = this.__response();
                    this.__parent().__response(r);
                    this.__response(null);

                    // inform parent that we're done
                    this.__parent().next();
                }

                // clear parent so that this chain can be relinked
                this.__parent(null);
                this.__queue('empty');
            }
            else
            {
                // run the next element in the queue
                this.run();
            }
        };

        /**
         * Tells the chain to sleep the given number of milliseconds
         */
        proxiedObject.wait = function(ms)
        {
            return this.then(function() {

                var wake = function(chain)
                {
                    return function()
                    {
                        chain.next();
                    };
                }(this);

                window.setTimeout(wake, ms);

                return false;
            });
        };

        /**
         * Registers an error handler;
         *
         * @param errorHandler
         */
        proxiedObject.trap = function(errorHandler)
        {
            this.errorHandler = errorHandler;

            return this;
        };

        /**
         * Handles the error.
         *
         * @param err
         */
        proxiedObject.error = function(err)
        {
            // find the first error handler we can walking up the chain
            var errorHandler = null;
            var ancestor = this;
            while (ancestor && !errorHandler)
            {
                errorHandler = ancestor.errorHandler;
                if (!errorHandler)
                {
                    ancestor = ancestor.__parent();
                }
            }

            // clean up the chain so that it can still be used
            this.__queue('empty');
            this.__response(null);

            // disconnect and stop the parent from processing
            if (this.__parent())
            {
                this.__parent().__queue('empty');
                this.__parent().__waiting(false);
            }

            // invoke error handler
            if (errorHandler)
            {
                var code = errorHandler.call(this, err);

                // finish out the chain if we didn't get "false"
                if (code !== false)
                {
                    this.next();
                }
            }
        };

        /**
         * Completes a chain and hands control back up to the parent.
         */
        proxiedObject.done = function()
        {
            return this.__parent();
        };

        /**
         * Creates a new chain for this object
         */
        proxiedObject.chain = function()
        {
            return Chain(this).then(function() {
                // empty chain to kick start
            });
        };


        // if there is already a clone property, don't override it
        if (!proxiedObject.clone)
        {
            /**
             * Clones this chain and resets chain properties.
             */
            proxiedObject.clone = function()
            {
                // based on Crockford's solution for clone using prototype on function
                // this copies all properties and methods
                // includes copies of chain functions
                function F() {}
                F.prototype = this;
                var object = new F();

                return Chain(object);
            };
        }

        return proxiedObject;
    };

    /**
     * Wraps the given object into a proxy.
     *
     * If the object is an existing proxy, it is unpackaged and re-proxied.
     * @param o
     */
    Chain.proxy = function(o)
    {
        if (o._getOriginal && o._getOriginal())
        {
            o = Chain.unproxy(o);
        }

        // wraps the object into a proxy
        function Z() {};
        Z.prototype = o;
        var proxy = new Z();
        proxy._getOriginal = function() {
            return o;
        };
        proxy._getProxied = function() {
            return true;
        };

        return proxy;
    };

    /**
     * Hands back the original object for a proxy.
     *
     * @param proxy
     */
    Chain.unproxy = function(proxy)
    {
        var o = null;

        if (proxy._getOriginal && proxy._getOriginal())
        {
            o = proxy._getOriginal();
        }

        return o;
    };

})(window);