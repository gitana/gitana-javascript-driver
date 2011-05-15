(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Chainable = Base.extend(
    /** @lends Gitana.Chainable.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @param {Gitana.Driver} driver
         *
         * @class Provides common chaining functions used by various interface methods
         */
        constructor: function(driver)
        {
            var self = this;

            this.base();


            ///////////////////////////////////////////////////////////////////////////////////////////////////////
            //
            // privileged methods
            //
            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            this.getDriver = function()
            {
                return driver;
            };

            this.getFactory = function()
            {
                return new Gitana.ObjectFactory();
            };

            this.httpError = function(http)
            {
                var err = new Error();
                err.name = "Http Error";
                err.message = JSON.parse(http.responseText).message;
                err.http = http;

                this.error(err);

                return false;
            };

            this.missingNodeError = function(id)
            {
                var err = new Error();
                err.name = "Missing Node error";
                err.message = "The node: " + id + " could not be found";

                this.error(err);

                return false;
            };




            /////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED
            // CHAIN HANDLERS
            //
            /////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Helper to produce the next link in the chain
             *
             * If chainable is an object, it will be wrapped in a subchain function.
             * If chainable is false or null or this, then "this" is handed back.
             *
             * The reason we hand "this" back is because the call to then() will automatically build a subchain
             * for the current object.  No sense doing it twice.
             *
             * @param chainable
             */
            this.link = function(chainable)
            {
                /*
                if (!chainable || chainable == this)
                {
                    return this;
                }
                */

                return this.subchain(chainable);
            };

            /**
             * Performs a GET from the server and populates the chainable.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             */
            this.chainGet = function(chainable, uri)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Creates an object on the server (write + read).
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param object
             * @param uri
             * @param createParams
             */
            this.chainCreate = function(chainable, object, uri, createParams)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // params
                    var paramString = "";
                    if (createParams)
                    {
                        paramString += "?";

                        for (var key in createParams) {
                            paramString += "&" + key + "=" + createParams[key];
                        }
                    }

                    // create
                    driver.gitanaPost(uri + paramString, object, function(status) {
                        driver.gitanaGet(uri + "/" + status.getId(), function(response) {
                            chain.handleResponse(response);
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
             * Creates an object on the server using one URL and then reads it back using another URL.
             * This exists because the security responses don't include _doc fields like other responses.
             *
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param object
             * @param createUri
             * @param readUri
             */
            this.chainCreateEx = function(chainable, object, createUri, readUri)
            {
                return this.link(chainable).then(function() {

                    var chain = this;

                    // create
                    driver.gitanaPost(createUri, object, function(status) {
                        driver.gitanaGet(readUri, function(response) {
                            chain.handleResponse(response);
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
             * Performs a POST to the server and populates the chainable with results.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param payload
             */
            this.chainPost = function(chainable, uri, payload)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, payload, function(response) {
                        chain.handleResponse(response);
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a POST to the server.  The response is not handled.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param payload (optional)
             * @param contentType (optional) - example "text/plain"
             */
            this.chainPostEmpty = function(chainable, uri, payload, contentType)
            {
                var self = this;

                // if no payload, leave f
                if (!payload)
                {
                    payload = {};
                }

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, payload, function(response) {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a POST to the server.  The response is not handled.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param contentType (optional) - example "text/plain"
             * @param payload (optional)
             */
            this.chainUpload = function(chainable, uri, contentType, payload)
            {
                var self = this;

                // if no payload, leave f
                if (!payload)
                {
                    payload = {};
                }

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaUpload(uri, contentType, payload, function(response) {
                        chain.next();
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a GET to the server and pushes the response into the chain.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             */
            this.chainGetResponse = function(chainable, uri)
            {
                var self = this;

                return this.link(chainable).then(function() {

                    var chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, function(response) {
                        chain.next(response);
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a GET to the server and pushes the "rows" response attribute into the chain.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             */
            this.chainGetResponseRows = function(chainable, uri)
            {
                return this.chainGetResponse(chainable, uri).then(function() {
                    return this.response["rows"];
                });
            };

            /**
             * Performs a GET to the server and checks whether the "rows" array attribute of the response
             * has the given value.
             *
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param value
             */
            this.chainHasResponseRow = function(chainable, uri, value)
            {
                return this.chainGetResponse(chainable, uri).then(function() {
                    var authorized = false;
                    for (var i = 0; i < this.response.rows.length; i++)
                    {
                        if (this.response.rows[i].toLowerCase() == value.toLowerCase())
                        {
                            authorized = true;
                        }
                    }
                    return authorized;
                });
            };

            /**
             * Helper to gets the principal id for a principal object, json structure or principal id itself.
             *
             * @param principal
             */
            this.extractPrincipalId = function(principal)
            {
                var principalId = null;
                if (Gitana.isString(principal))
                {
                    principalId = principal;
                }
                else
                {
                    if (principal.getPrincipalId)
                    {
                        principalId = principal.getPrincipalId();
                    }
                    else
                    {
                        principalId = principal["principal-id"];
                    }
                }

                return principalId;
            }
        }

    });

})(window);
