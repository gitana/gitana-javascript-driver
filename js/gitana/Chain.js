(function(window)
{
    /**
     * Creates a chain.  If an object is provided, the chain is augmented onto the object.
     *
     * @param object
     * @param skipAutoTrap
     */
    Chain = function(object, skipAutoTrap)
    {
        if (!object)
        {
            object = {};
        }

        // wraps the object into a proxy
        const proxiedObject = Chain.proxy(object);

        // the following methods get pushed onto the chained object
        // methods for managing chain state
        proxiedObject.__queue = (function() {
            let queue = [];
            return function(x) {
                if (x) { if (x === 'empty') { queue = []; } else { queue.push(x); }}
                return queue;
            };
        })();
        proxiedObject.__response = (function() {
            let response = null;
            return function(x) {
                if (!Gitana.isUndefined(x)) { if (x) { response = x; } else { response = null; } }
                return response;
            };
        })();
        proxiedObject.__waiting = (function() {
            let waiting = false;
            return function(x) {
                if (!Gitana.isUndefined(x)) { waiting = x; }
                return waiting;
            };
        })();
        proxiedObject.__parent = (function() {
            let parent = null;
            return function(x) {
                if (!Gitana.isUndefined(x)) { if (x) { parent = x; } else { parent = null; } }
                return parent;
            };
        })();
        proxiedObject.__id = (function() {
            let id = Chain.idCount;
            Chain.idCount++;
            return function() {
                return id;
            };
        })();
        proxiedObject.__helper = (function() {
            let helper = null;
            return function(x) {
                if (x) { helper = x; }
                return helper;
            };
        })();
        // marks any chain links which are placeholders for functions
        proxiedObject.__transparent = (function() {
            let transparent = false; // assume not transparent
            return function(x) {
                if (!Gitana.isUndefined(x)) { transparent = x; }
                return transparent;
            };
        })();
        // provides consume behavior for copy into (from another object into this one)
        if (!proxiedObject.__copyState) {
            proxiedObject.__copyState = function(other) {
                Gitana.copyInto(this, other);
            };
        }




        /**
         * Queues either a callback function, an array of callback functions or a subchain.
         *
         * @param element
         * @param [functionName] function name for debugging
         */
        proxiedObject.then = function(element, functionName)
        {
            const self = this;

            let autorun = false;

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
                const array = element;

                // parallel function invoker
                const parallelInvoker = function()
                {
                    // build out parallel functions
                    const fns = [];
                    for (let i = 0; i < array.length; i++)
                    {
                        const fn = function(func)
                        {
                            return function(done)
                            {
                                // each function gets loaded onto its own "parallel" chain
                                // the parallel chain contains a subchain and the onComplete method
                                // the parallel chain is a clone of this chain
                                // the subchain runs the function
                                // these are serial so that the subchain must complete before the onComplete method is called
                                const parallelChain = Chain(); // note: empty chain (parent)
                                parallelChain.__waiting(true); // this prevents auto-run (which would ground out the first subchain call)
                                parallelChain.subchain(self).then(function () { // TODO: should we self.clone() for parallel operations?
                                    func.call(this);
                                });
                                parallelChain.then(function () {
                                    done();
                                });
                                parallelChain.__waiting(false); // switch back to normal
                                parallelChain.run();
                            };
                        }(array[i]);
                        fns.push(fn);
                    }

                    let count = 0;
                    const total = fns.length;
                    const onComplete = function()
                    {
                        count++;
                        if (count === total)
                        {
                            // manually signal that we're done
                            self.next();
                        }
                    };

                    // run all of the functions in parallel
                    for (let i = 0; i < fns.length; i++)
                    {
                        window.setTimeout(function(fn) {
                            return function() {
                                fn(function() {
                                    onComplete();
                                });
                            };
                        }(fns[i]));
                    }

                    // return false so that we wait for manual self.next() signal
                    return false;
                };

                // build a subchain (transparent)
                const subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.__queue(parallelInvoker);
                if (functionName) { subchain.__helper(functionName); }
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
                const subchain = this.subchain(null, true); // don't auto add, we'll do it ourselves
                subchain.__queue(element);
                if (functionName) { subchain.__helper(functionName); }
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
                let runner = this;
                while (runner.__parent())
                {
                    runner = runner.__parent();
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
            const self = this;

            // short cut, if nothing in the queue, bail
            if (this.__queue().length === 0 || this.__waiting())
            {
                return this;
            }

            // mark that we're running something
            this.__waiting(true);

            // the element to run
            const element = this.__queue().shift();

            // case: callback function
            if (Gitana.isFunction(element))
            {
                // it's a callback function
                const callback = element;

                // try to determine response and previous response
                let response = null;
                let previousResponse = null;
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
                    Chain.log(self, (self.__helper() ? self.__helper()+ " " : "") + "> " + element.toString());

                    // execute with "this = chain"
                    const returned = callback.call(self, response, previousResponse);
                    if (returned !== false)
                    {
                        self.next(returned);
                    }
                }, 0);
            }
            else
            {
                // it's a subchain element (object)
                // we make sure to copy response forward
                const subchain = element;
                subchain.__response(this.__response());

                // pre-emptively copy forward into subchain
                // only do this if the subchain is transparent
                if (subchain.__transparent())
                {
                    //Gitana.copyInto(subchain, this);
                    subchain.__copyState(this);
                }

                // BEFORE CHAIN RUN CALLBACK
                // this provides a way for a chained object to adjust its method signatures and state ahead
                // of actually executing, usually based on some data that was loaded (such as the type of object
                // like a domain user or group)
                //
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
            let transparent = false;
            if (!object) {
                transparent = true;
            }

            if (!object)
            {
                object = this;
            }

            const subchain = Chain(object, true);
            subchain.__parent(this);

            // BEFORE CHAIN RUN CALLBACK
            // this provides a way for a chained object to adjust its method signatures and state ahead
            // of actually executing, usually based on some data that was loaded (such as the type of object
            // like a domain user or group)
            //
            if (subchain.beforeChainRun)
            {
                subchain.beforeChainRun.call(subchain);
            }

            if (!noAutoAdd)
            {
                this.then(subchain);
            }

            subchain.__transparent(transparent);

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
         * @param {Object} response
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
            if (this.__queue().length === 0)
            {
                if (this.__parent())
                {
                    // copy response up to parent
                    const r = this.__response();
                    this.__parent().__response(r);
                    this.__response(null);

                    // if the current node is transparent, then copy back to parent
                    //if (this.__transparent())
                    if (this.__transparent())
                    {
                        Gitana.deleteProperties(this.__parent());
                        //Gitana.copyInto(this.__parent(), this);
                        this.__parent().__copyState(this);
                    }

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

                const wake = function(chain)
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
            let errorHandler = null;
            let ancestor = this;
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

            if (!errorHandler)
            {
                errorHandler = Gitana.defaultErrorHandler;
            }

            // invoke error handler
            const code = errorHandler.call(this, err);

            // finish out the chain if we didn't get "false"
            if (code !== false)
            {
                this.next();
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
            return Chain(this, true).then(function() {
                // empty chain to kick start
            });
        };


        // each object that gets chained provides a clone() method
        // if there is already a clone property, don't override it
        // this allows implementation classes to control how they get cloned
        if (!proxiedObject.clone)
        {
            /**
             * Clones this chain and resets chain properties.
             */
            proxiedObject.clone = function()
            {
                return Chain.clone(this);
            };
        }

        // apply auto trap?
        if (!skipAutoTrap && autoTrap())
        {
            proxiedObject.trap(autoTrap());
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
        if (o.__original && o.__original())
        {
            // NOTE: we can't just unproxy since that loses all state of the current object

            // unproxy back to original
            //o = Chain.unproxy(o);

            // for now, we can do this?
            delete o.__original;
        }

        // clone the object using clone() method
        let proxy = null;
        if (o.clone) {
            proxy = o.clone();
        } else {
            proxy = Chain.clone(o);
        }
        proxy.__original = function() {
            return o;
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
        let o = null;

        if (proxy.__original && proxy.__original())
        {
            o = proxy.__original();
        }

        return o;
    };

    Chain.debug = false;
    Chain.log = function(chain, text)
    {
        if (Chain.debug && !Gitana.isUndefined(console))
        {
            const f = function()
            {
                let identifier = this.__id();
                if (this.__transparent()) {
                    identifier += "[t]";
                }

                if (!this.__parent())
                {
                    return identifier;
                }

                return f.call(this.__parent()) + " > " + identifier;
            };

            const identifier = f.call(chain);

            console.log("Chain[" + identifier + "] " + text);
        }
    };
    // clone workhorse method
    Chain.clone = function(object)
    {
        // based on Crockford's solution for clone using prototype on function
        // this copies all properties and methods
        // includes copies of chain functions
        function F() {}
        F.prototype = object;
        const clone = new F();

        // copy properties
        Gitana.copyInto(clone, object);

        return clone;
    };

    let autoTrapValue = null;
    const autoTrap = Chain.autoTrap = function(_autoTrap)
    {
        if (_autoTrap)
        {
            autoTrapValue = _autoTrap;
        }

        return autoTrapValue;
    };

    Chain.idCount = 0;

})(window);