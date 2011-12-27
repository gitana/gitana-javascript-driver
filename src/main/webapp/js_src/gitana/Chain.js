(function(window)
{
    /**
     * Creates a chain.  If an object is provided, the chain is augmented onto the object.
     *
     * @param object
     */
    Chain = function(object)
    {
        var generateId = function()
        {
            if (!Chain.idCount)
            {
                Chain.idCount = 0;
            }

            return "chain-" + Chain.idCount++;
        };

        if (!object)
        {
            object = {};
        }

        // wraps the object into a proxy
        var chain;
        /** @namespace */
        chain = Chain.proxy(object);


        // populate chain properties
        chain.queue = [];
        chain.response = null;
        chain.waiting = false;
        chain.id = generateId();
        chain.parent = null;

        // populate chain methods

        /**
         * Queues either a callback function, an array of callback functions or a subchain.
         *
         * @param element
         */
        chain.then = function(element)
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
                            parallelChain.waiting = true; // this prevents auto-run (which would ground out the first subchain call)
                            parallelChain.subchain(self).then(function() { // TODO: should we self.clone() for parallel operations?
                                func.call(this);
                            });
                            parallelChain.then(function() {
                                onComplete();
                            });
                            parallelChain.waiting = false; // switch back to normal
                            parallelChain.run();
                        };
                        x(func);
                    }

                    // return false so that we wait for manual self.next() signal
                    return false;
                };

                // build a subchain
                var subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.queue.push(parallelInvoker);
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
                subchain.queue.push(element);
                element = subchain;

                // note: because we're given a function, we can tell this chain to try to "autorun"
                autorun = true;
            }


            // anything that arrives this far is just a subchain


            this.queue.push(element);


            // if we're able to autorun (meaning that we were told to then() a function)...
            // we climb the parents until we find the topmost parent and tell it to run.
            if (autorun && !this.waiting)
            {
                var runner = this;
                while (runner.parent)
                {
                    runner = runner.parent;
                }

                if (!runner.waiting)
                {
                    runner.run();
                }
            }

            // if nothing is currently running, see if there is something on the queue that we can burn through
            /*
            if (!this.waiting && !this.parent)
            {
                // run something off the queue
                this.run();
            }
            */

            // always hand back reference to ourselves
            return this;
        };

        /**
         * Run the next element in the queue
         */
        chain.run = function()
        {
            var self = this;

            // short cut, if nothing in the queue, bail
            if (this.queue.length == 0 || this.waiting)
            {
                return this;
            }

            // mark that we're running something
            this.waiting = true;

            // the element to run
            var element = this.queue.shift();

            // case: callback function
            if (Gitana.isFunction(element))
            {
                // it's a callback function
                var callback = element;

                // try to determine response and previous response
                var response = null;
                var previousResponse = null;
                if (this.parent)
                {
                    response = this.parent.response;
                    if (this.parent.parent)
                    {
                        previousResponse = this.parent.parent.response;
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
                subchain.response = this.response; // copy response down into it first
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
        chain.subchain = function(object, noAutoAdd)
        {
            if (!object)
            {
                object = this;
            }

            var subchain = Chain(object);
            subchain.parent = this;

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
        chain.next = function(response)
        {
            // toggle responses
            if (typeof response !== "undefined")
            {
                this.response = response;
            }

            // no longer processing callback
            this.waiting = false;

            // if there isn't anything left in the queue, then we're done
            // if we have a parent, we can signal that we've completed
            if (this.queue.length == 0)
            {
                if (this.parent)
                {
                    // copy response up to parent
                    var r = this.response;
                    this.parent.response = r;
                    delete this.response;

                    // inform parent that we're done
                    this.parent.next();
                }

                // clear parent so that this chain can be relinked
                this.parent = null;
                this.queue = [];
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
        chain.wait = function(ms)
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
        chain.trap = function(errorHandler)
        {
            this.errorHandler = errorHandler;

            return this;
        };

        /**
         * Handles the error.
         *
         * @param err
         */
        chain.error = function(err)
        {
            // find the first error handler we can walking up the chain
            var errorHandler = null;
            var ancestor = this;
            while (ancestor && !errorHandler)
            {
                errorHandler = ancestor.errorHandler;
                if (!errorHandler)
                {
                    ancestor = ancestor.parent;
                }
            }

            // clean up the chain so that it can still be used
            this.queue = [];
            this.response = null;

            // disconnect and stop the parent from processing
            if (this.parent)
            {
                this.parent.queue = [];
                this.parent.waiting = false;
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
         * Creates a new chain for this object
         */
        chain.chain = function()
        {
            return Chain(this).then(function() {
                // empty chain to kick start
            });
        };


        // if there is already a clone property, don't override it
        if (!chain.clone)
        {
            /**
             * Clones this chain and resets chain properties.
             */
            chain.clone = function()
            {
                var object = {};

                // copies properties
                Gitana.copyInto(object, this);

                Chain(object);

                return object;
            };
        }

        return chain;
    };

    /**
     * Wraps the given object into a proxy.
     *
     * If the object is an existing proxy, it is unpackaged and re-proxied.
     * @param o
     */
    Chain.proxy = function(o)
    {
        if (o.original)
        {
            o = Chain.unproxy(o);
        }

        // wraps the object into a proxy
        function Z() {};
        Z.prototype = o;
        var proxy = new Z();
        proxy.original = o;
        proxy.proxy = true;

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

        if (proxy.original)
        {
            o = proxy.original;
        }

        return o;
    }

})(window);