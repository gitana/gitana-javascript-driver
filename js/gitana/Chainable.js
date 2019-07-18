(function(window)
{
    Gitana = window.Gitana;

    Gitana.Chainable = Base.extend(
    /** @lends Gitana.Chainable.prototype */
    {
        /**
         * @constructs
         *
         * @param {Gitana.Driver} driver
         *
         * @class Provides common chaining functions used by various interface methods
         */
        constructor: function(driver)
        {
            this.base();

            /**
             * Override the Chain.__copyState method so that it utilizes a base method that we can override
             * on a per-class basis.
             */
            this.__copyState = function(other) {
                Gitana.copyInto(this, other);
                this.chainCopyState(other);
            };



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

            this.httpError = function(httpError)
            {
                const err = new Gitana.Error();
                err.name = "Http Error";
                err.message = httpError.message;
                err.status = httpError.status;
                err.statusText = httpError.statusText;

                if (httpError.errorType)
                {
                    err.errorType = httpError.errorType;
                }

                // stack trace might be available
                if (httpError.stacktrace)
                {
                    err.stacktrace = httpError.stacktrace;
                }

                // info that might come back
                if (httpError.info)
                {
                    err.info = httpError.info;
                }

                // any text?  if so, capture it
                if (httpError.response && httpError.response.text)
                {
                    err.responseText = httpError.response.text;

                    // and also make an attempt to convert to JSON data
                    try {
                        err.responseData = JSON.parse(err.responseText);
                    } catch (e) { }
                }

                this.error(err);

                return false;
            };

            this.missingNodeError = function(id)
            {
                const err = new Gitana.Error();
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
             * Performs a GET from the server and populates the chainable.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainGet = function(chainable, uri, params)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, params, {}, function(response) {
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
             * @param params
             */
            this.chainCreate = function(chainable, object, uri, params)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, object, function(status) {
                        driver.gitanaGet(uri + "/" + status.getId(), null, {}, function(response) {
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

                }, "chainCreate");
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
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(createUri)) {
                        createUri = createUri.call(self);
                    }

                    // create
                    driver.gitanaPost(createUri, null, object, function(status) {

                        // allow for closures on uri for late resolution
                        if (Gitana.isFunction(readUri)) {
                            readUri = readUri.call(self, status);
                        }

                        driver.gitanaGet(readUri, null, {}, function(response) {
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
             * @param params
             * @param payload
             * @param handleFn
             */
            this.chainPost = function(chainable, uri, params, payload, handleFn)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, payload, function(response) {
                        if (handleFn) {
                            handleFn(chain, response);
                        } else {
                            chain.handleResponse(response);
                        }
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
             * @param params
             * @param payload (optional)
             * @param contentType (optional) - example "text/plain"
             */
            this.chainPostEmpty = function(chainable, uri, params, payload, contentType)
            {
                const self = this;

                // if no payload, set to empty
                if (!payload && contentType)
                {
                    if (contentType.indexOf("text/") > -1)
                    {
                        payload = "";
                    }
                    else if (contentType === "application/json")
                    {
                        payload = {};
                    }
                }

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaPost(uri, params, payload, function() {
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
             * @param params
             * @param contentType (optional) - example "text/plain"
             * @param payload (optional)
             */
            this.chainUpload = function(chainable, uri, params, contentType, payload)
            {
                const self = this;

                // if no payload, set to empty
                if (!payload && contentType)
                {
                    if (contentType.indexOf("text/") > -1)
                    {
                        payload = "";
                    }
                    else if (contentType === "application/json")
                    {
                        payload = {};
                    }
                }

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    // create
                    driver.gitanaUpload(uri, params, contentType, payload, function() {
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
             * @param params
             */
            this.chainGetResponse = function(chainable, uri, params)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaGet(uri, params, {}, function(response) {
                        chain.next(response);
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };

            /**
             * Performs a GET to the server and pushes the text response to the callback.
             *
             * @param chainable
             * @param uri
             * @param params
             */
            this.chainGetResponseText = function(chainable, uri, params)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaRequest("GET", uri, params, "text/plain", null, {}, function(response) {
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
             * @param params
             */
            this.chainGetResponseRows = function(chainable, uri, params)
            {
                return this.chainGetResponse(chainable, uri, params).then(function(response) {
                    return response["rows"];
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
                return this.chainGetResponse(chainable, uri).then(function(response) {
                    let authorized = false;
                    for (let i = 0; i < response.rows.length; i++)
                    {
                        if (response.rows[i].toLowerCase() === value.toLowerCase())
                        {
                            authorized = true;
                        }
                    }
                    return authorized;
                });
            };

            /**
             * Performs a POST to the server and pushes the response into the chain.
             * Proceeds with the chain as bound to the chainable.
             *
             * @param chainable
             * @param uri
             * @param params
             * @param payload
             */
            this.chainPostResponse = function(chainable, uri, params, payload)
            {
                const self = this;

                return this.subchain(chainable).then(function() {

                    const chain = this;

                    // allow for closures on uri for late resolution
                    if (Gitana.isFunction(uri)) {
                        uri = uri.call(self);
                    }

                    driver.gitanaPost(uri, params, payload, function(response) {
                        chain.next(response);
                    }, function(http) {
                        self.httpError(http);
                    });

                    // NOTE: we return false to tell the chain that we'll manually call next()
                    return false;
                });
            };


            /**
             * Helper to gets the principal id for a principal object, json structure or principal id itself.
             * This returns something like "domainId/principalId"
             *
             * @param principal
             * @param defaultDomainId
             */
            this.extractPrincipalDomainQualifiedId = function(principal, defaultDomainId)
            {
                const identifiers = this.extractPrincipalIdentifiers(principal, defaultDomainId);

                return identifiers["domain"] + "/" + identifiers["principal"];
            };

            /**
             * Helper to gets the principal id for a principal object, json structure or principal id itself.
             * This returns something like "domainId/principalId"
             *
             * @param principal principal object or string (principal id or domain qualified principal id)
             * @param defaultDomainId
             */
            this.extractPrincipalIdentifiers = function(principal, defaultDomainId)
            {
                const identifiers = {};

                if (!defaultDomainId)
                {
                    defaultDomainId = "default";
                }

                if (Gitana.isString(principal))
                {
                    const x = principal.indexOf("/");
                    if (x > -1)
                    {
                        identifiers["domain"] = principal.substring(0, x);
                        identifiers["principal"] = principal.substring(x + 1);
                    }
                    else
                    {
                        identifiers["domain"] = defaultDomainId;
                        identifiers["principal"] = principal;
                    }
                }
                else if (principal.objectType && principal.objectType() === "Gitana.DomainPrincipal")
                {
                    identifiers["domain"] = principal.getDomainId();
                    identifiers["principal"] = principal.getId();
                }
                else if (principal.objectType && principal.objectType() === "Gitana.TeamMember")
                {
                    identifiers["domain"] = principal["domainId"];
                    identifiers["principal"] = principal["_doc"];
                }
                else if (principal["_doc"])
                {
                    identifiers["domain"] = defaultDomainId;
                    identifiers["principal"] = principal["_doc"];
                }
                else if (principal["name"])
                {
                    identifiers["domain"] = defaultDomainId;
                    identifiers["principal"] = principal["name"];
                }

                return identifiers;
            };
        },

        /**
         * Used internally during chain copy going forward or backward through the chain.
         *
         * This is wired into the Chain.__copyState method and allows a convenient way to override
         * chain copy behavior on a per-object-type basis.
         *
         * @param otherObject
         */
        chainCopyState: function(otherObject)
        {
        }

    });

})(window);
