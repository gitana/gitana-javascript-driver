(function(window)
{
    var Gitana = window.Gitana;

    Gitana.AbstractObject = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.AbstractObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Abstract base class for Gitana document objects.
         *
         * @param {Gitana} driver
         * @param {Object} [object]
         */
        constructor: function(driver, object)
        {
            this.__system = (function() {
                var _system = new Gitana.SystemMetadata();
                return function(system) {
                    if (!Gitana.isUndefined(system)) { _system.updateFrom(system); }
                    return _system;
                };
            })();




            ///////////////////////////////////////////////////////////////////////////////////////////////
            //
            // INSTANCE CHAINABLE METHODS
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Executes an HTTP delete for this object and continues the chain with the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainDelete = function(chainable, uri, params)
            {
                var self = this;

                return this.subchain(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // delete
                    chain.getDriver().gitanaDelete(uri, params, function() {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Reloads this object from the server and then passes control to the chainable.
             *
             * @param uri
             * @param params
             */
            this.chainReload = function(chainable, uri, params)
            {
                var self = this;

                return this.subchain(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // reload
                    chain.getDriver().gitanaGet(uri, params, {}, function(obj) {
                        chain.handleResponse(obj);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Executes an update (write + read) of this object and then passes control to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainUpdate = function(chainable, uri, params)
            {
                var self = this;

                return this.subchain(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // delete
                    chain.getDriver().gitanaPut(uri, params, chain, function() {
                        chain.getDriver().gitanaGet(uri, params, {}, function(obj) {
                            chain.handleResponse(obj);
                            chain.next();
                        }, function(http) {
                            self.httpError(http);
                        });
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a PATCH to the server and populates the chainable with results.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             * @param payload
             */
            this.chainPatch = function(chainable, uri, params, payload)
            {
                var self = this;

                return this.subchain(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPatch(uri, params, payload, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };


            // finally chain to parent prototype
            this.base(driver, object);
        },

        /**
         * Override to include:
         *
         *   __system
         *
         * @param otherObject
         */
        chainCopyState: function(otherObject)
        {
            this.base(otherObject);

            // include __system properties?
            if (otherObject.__system) {
                this.__system(otherObject.__system());
            }
        },

        /**
         * @EXTENSION_POINT
         */
        getUri: function()
        {
            return null;
        },

        /**
         * @abstract
         */
        getType: function()
        {
            return null;
        },

        /**
         * @abstract
         *
         * @returns {String} a string denoting a reference to this object.
         */
        ref: function()
        {
            return null;
        },

        /**
         * Hands back the URI of this object as referenced by the browser.
         */
        getProxiedUri: function()
        {
            return this.getDriver().baseURL + this.getUri();
        },

        /**
         * Get a json property
         *
         * @param key
         */
        get: function(key)
        {
            return this[key];
        },

        /**
         * Set a json property
         *
         * @param key
         * @param value
         */
        set: function(key ,value)
        {
            this[key] = value;
        },

        /**
         * Hands back the ID ("_doc") of this object.
         *
         * @public
         *
         * @returns {String} id
         */
        getId: function()
        {
            return this.get("_doc");
        },

        /**
         * Hands back the system metadata for this object.
         *
         * @public
         *
         * @returns {Gitana.SystemMetadata} system metadata
         */
        getSystemMetadata: function()
        {
            return this.__system();
        },

        /**
         * The title for the object.
         *
         * @public
         *
         * @returns {String} the title
         */
        getTitle: function()
        {
            return this.get("title");
        },

        /**
         * The description for the object.
         *
         * @public
         *
         * @returns {String} the description
         */
        getDescription: function()
        {
            return this.get("description");
        },

        // TODO: this is a temporary workaround at the moment
        // it has to do all kinds of special treatment for _ variables because these variables are
        // actually system managed but they're on the top level object.
        //
        // TODO:
        // 1) gitana repo system managed properties should all be under _system
        // 2) the system block should be pulled off the object on read and not required on write

        /**
         * Replaces all of the properties of this object with those of the given object.
         * This method should be used to update the state of this object.
         *
         * Any functions from the incoming object will not be copied.
         *
         * @public
         *
         * @param object {Object} object containing the properties
         */
        replacePropertiesWith: function(object)
        {
            // create a copy of the incoming object
            var candidate = {};
            Gitana.copyInto(candidate, object);

            // we don't allow the following values to be replaced
            var backups = {};
            backups["_doc"] = this["_doc"];
            delete candidate["_doc"];
            backups["_type"] = this["_type"];
            delete candidate["_type"];
            backups["_qname"] = this["_qname"];
            delete candidate["_qname"];

            // remove our properties (not functions)
            Gitana.deleteProperties(this, false);

            // restore
            this["_doc"] = backups["_doc"];
            this["_type"] = backups["_type"];
            this["_qname"] = backups["_qname"];

            // copy in candidate properties
            Gitana.copyInto(this, candidate);
        },

        /**
         * @override
         */
        handleSystemProperties: function(response)
        {
            this.base(response);

            if (this["_system"])
            {
                // strip out system metadata
                var json = this["_system"];
                delete this["_system"];

                // update system properties
                this.__system().updateFrom(json);
            }
        },

        /**
         * Helper function to convert the object portion to JSON
         *
         * @param pretty
         */
        stringify: function(pretty)
        {
            return Gitana.stringify(this, pretty);
        },

        /**
         * Helper method that loads this object from another object of the same type.
         *
         * For example, loading a node from another loaded node.
         *
         * @param anotherObject
         */
        loadFrom: function(anotherObject)
        {
            this.handleResponse(anotherObject);
        }

    });

})(window);
