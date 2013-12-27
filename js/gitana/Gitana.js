(function(window)
{
    Gitana = Base.extend(
    /** @lends Gitana.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana
         *
         * Configuration options should look like:
         *
         * {
         *    "clientKey": {String} the oauth2 client id,
         *    "clientSecret": [String] the oauth2 client secret,
         *    "baseURL": [String] the relative URI path of the base URL (assumed to be "/proxy"),
         *    "locale": [String] optional locale (assumed to be en_US),
         *    "storage": [String|Object] Gitana.OAuth2.Storage implementation or a string identifying where to store
         *       Gitana OAuth2 tokens ("local", "session", "memory") or empty for memory-only storage
         * }
         */
        constructor: function(settings)
        {
            var self = this;

            if (!settings)
            {
                settings = {};
            }

            if (settings.host)
            {
                settings.baseURL = settings.host + "/proxy";
            }

            this.applicationInfo = {};
            this.stackInfo = {};

            // build config
            var config = {
                "clientKey": null,
                "clientSecret": null,
                "baseURL": "/proxy",
                "locale": null,
                "application": null,
                "loadAppHelper": true,
                "storage": null
            };
            Gitana.copyKeepers(config, Gitana.loadDefaultConfig());
            Gitana.copyKeepers(config, settings);


            //////////////////////////////////////////////////////////////////////////
            //
            // APPLY CONFIGURATION SETTINGS
            //

            // baseURL
            this.baseURL = config.baseURL;

            // locale
            this.locale = config.locale;




            //////////////////////////////////////////////////////////////////////////
            //
            // APPLY OAUTH2 SETTINGS
            //

            // set up our oAuth2 connection
            var options = {};
            if (config.clientKey) {
                options.clientKey = config.clientKey;
            }
            if (config.clientSecret) {
                options.clientSecret = config.clientSecret;
            }
            if (this.baseURL)
            {
                options.baseURL = this.baseURL;
                options.tokenURL = "/oauth/token";
            }
            // the driver requires the "api" scope to be granted
            options.requestedScope = "api";



            //////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //

            this.updateOptions = function(o)
            {
                if (o)
                {
                    Gitana.copyInto(options, o);
                }
            };

            this.resetHttp = function(config)
            {
                var o = {};
                Gitana.copyInto(o, options);

                if (config)
                {
                    Gitana.copyInto(o, config);
                }

                if (!o.storage)
                {
                    o.storage = this.getOriginalConfiguration().storage;
                }

                self.http = new Gitana.OAuth2Http(o, o.storage);
            };

            this.setAuthInfo = function(authInfo)
            {
                this.authInfo = authInfo;
            };

            this.setStackInfo = function(stackInfo)
            {
                this.stackInfo = stackInfo;
            };

            this.setApplicationInfo = function(applicationInfo)
            {
                this.applicationInfo = applicationInfo;
            };

            this.getOriginalConfiguration = function()
            {
                return config;
            };

            this.getHttpHeaders = function()
            {
                var self = this;

                var headers = {};

                if (self.http && self.http.getBearerAuthorizationHeader())
                {
                    headers["Authorization"] = self.http.getBearerAuthorizationHeader();
                }

                return headers;
            }
        },

        /**
         * Sets the authentication info
         */
        getAuthInfo: function()
        {
            return this.authInfo;
        },

        getStackInfo: function()
        {
            return this.stackInfo;
        },

        getApplicationInfo: function()
        {
            return this.applicationInfo;
        },

        /**
         * Sets the default locale for interactions with the Gitana server by this driver.
         *
         * @public
         *
         * @param {String} locale locale string
         */
        setLocale: function(locale)
        {
            this.locale = locale;
        },

        /**
         * Retrieves the default locale being used by this driver.
         *
         * @returns {String} locale string
         */
        getLocale: function()
        {
            return this.locale;
        },

        /**
         * Default AJAX failure callback
         *
         * @public
         */
        defaultFailureCallback: function(http)
        {
            // if we're in debug mode, log a bunch of good stuff out to console
            if (this.debug)
            {
                if (!(typeof console === "undefined"))
                {
                    var message = "Received bad http state (" + http.status + ")";
                    var stacktrace = null;

                    var responseText = http.responseText;
                    if (responseText)
                    {
                        var json = JSON.parse(responseText);
                        if (json.message)
                        {
                            message = message + ": " + json.message;
                        }
                    }

                    if (json["stacktrace"])
                    {
                        stacktrace = json["stacktrace"];
                    }

                    console.log(message);
                    if (stacktrace)
                    {
                        console.log(stacktrace);
                    }
                }
            }
        },


        /**
         * Performs Ajax communication with the Gitana server.
         *
         * NOTE: For the most part, you shouldn't have to use this function since most of the things you'd want
         * to do with the Gitana server are wrapped by helper functions.
         *
         * @see Gitana.Driver#gitanaGet
         * @see Gitana.Driver#gitanaPost
         * @see Gitana.Driver#gitanaPut
         * @see Gitana.Driver#gitanaDel
         * @see Gitana.Driver#gitanaRequest
         *
         * @public
         *
         * @param {String} method The kind of method to invoke - "get", "post", "put", or "del"
         * @param {String} url The full URL to the resource being requested (i.e. "http://server:port/uri"}
         * @param {String} [contentType] In the case of a payload carrying request (i.e. not GET), the content type being sent.
         * @param {Object} [data] In the case of a payload carrying request (i.e. not GET), the data to plug into the payload.
         * @param {Object} [headers] A key/value map of headers to place into the request.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.  If none provided, the default driver callback is used.
         */
        ajax: function(method, url, contentType, data, headers, successCallback, failureCallback)
        {
            var _this = this;

            // ensure headers
            if (!headers)
            {
                headers = {};
            }

            // treat the method
            if (method == null) {
                method = "GET";
            }
            method = method.toUpperCase();

            // flags
            var json = false;
            if (contentType == "application/json")
            {
                json = true;
            }

            // error checking
            if ( (method == "POST" || method == "PUT") )
            {
                headers["Content-Type"] = contentType;
                if (!contentType)
                {
                    Gitana.debug("Performing method: " + method + " but missing content type");
                    return;
                }
            }

            var toSend = data;

            // special handling for json
            if (json)
            {
                // if empty payload for payload-bearing methods, populate with {}
                if (method == "PUT" || method == "POST")
                {
                    if (!data)
                    {
                        data = {};
                    }
                }

                if (!Gitana.isString(data))
                {
                    // stringify
                    toSend = Gitana.stringify(data);
                }
            }

            //
            // if the URL is relative and we're running in a browser, then we can pad the URL
            // based on the URL of the browser
            //
            // otherwise, we can't handle relative URLs
            //
            if (url.substring(0,1) == "/")
            {
                // if window.location exists, then we're running on a browser
                if (!Gitana.isUndefined(window.location))
                {
                    var u = window.location.protocol + "//" + window.location.host;
                    if (window.location.host.indexOf(":") == -1)
                    {
                        if (window.location.port) {
                            u += ":" + window.location.port;
                        }
                    }
                    url = u + url;
                }
                else
                {
                    // relative urls are not supported outside of the browser
                    throw new Error("Relative URL not supported outside of the browser: " + url);
                }
            }

            var config = {
                "method": method,
                "url": url,
                "data": toSend,
                "headers": headers,
                "success": successCallback,
                "failure": failureCallback
            };

            Gitana.requestCount++;
            this.http.request(config);

            return this;
        },

        /**
         * Send an HTTP request via AJAX to the Gitana Server.
         *
         * This method will additionally make sure of the following:
         *
         *   1) That the Gitana Driver authentication ticket is plugged onto the request.
         *   2) That the Gitana Driver locale is plugged onto the request.
         *   3) That full object data is returned (including metadata).
         *
         * @public
         *
         * @param {String} method The kind of method to invoke - "get", "post", "put", or "del"
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params parameter map
         * @param [String] contentType If the case of a payload carrying request (i.e. not GET), the content type being sent.
         * @param {Object} data In the case of a payload carrying request (i.e. not GET), the JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaRequest: function(method, url, params, contentType, data, successCallback, failureCallback)
        {
            // make sure we compute the real url
            if (Gitana.startsWith(url, "/")) {
                url = this.baseURL + url;
            }

            if (!failureCallback)
            {
                failureCallback = this.defaultFailureCallback;
            }

            /**
             * Primary success callback handler for oAuth call to server.
             *
             * @param responseObject
             * @param xhr
             */
            var onSuccess = function(responseObject, xhr)
            {
                if (successCallback)
                {
                    // call back with just the response text (or json)

                    var arg = responseObject.text;
                    if (contentType == "application/json")
                    {
                        arg = new Gitana.Response(JSON.parse(arg));
                    }

                    successCallback(arg);
                }
            };

            /**
             * Primary failure callback handler for oAuth call to server.
             *
             * @param responseObject
             * @param xhr
             */
            var onFailure = function(responseObject, xhr)
            {
                if (failureCallback)
                {
                    var httpError = {};

                    httpError["statusText"] = xhr.statusText;
                    httpError["status"] = xhr.status;

                    var message = null;
                    var stacktrace = null;

                    var arg = responseObject.text;
                    if (contentType == "application/json")
                    {
                        try
                        {
                            var obj = new Gitana.Response(JSON.parse(arg));
                            if (obj.message)
                            {
                                message = obj.message;
                            }
                            if (obj.stacktrace)
                            {
                                stacktrace = obj.stacktrace;
                            }
                        }
                        catch (e) { }
                    }
                    if (message)
                    {
                        httpError.message = message;
                    }
                    if (stacktrace)
                    {
                        httpError.stacktrace = stacktrace;
                    }

                    failureCallback(httpError);
                }
            };

            var headers = { };
            if (this.locale) {
                headers["accept-language"] = this.locale;
            }

            // ensure we have some params
            if (!params)
            {
                params = {};
            }

            // adjust url to include "full" as well as "metadata" if not included
            if (Gitana.isEmpty(params["metadata"]))
            {
                params["metadata"] = true;
            }
            if (Gitana.isEmpty(params["full"]))
            {
                params["full"] = true;
            }

            // cache buster
            var cacheBuster = new Date().getTime();
            params["cb"] = cacheBuster;

            // update URL to include params
            for (var paramKey in params)
            {
                var paramValue = params[paramKey];
                if (Gitana.isFunction(paramValue))
                {
                    paramValue = paramValue.call();
                }
                else if (Gitana.isString(paramValue))
                {
                    // NOTHING TO DO
                }
                else if (Gitana.isNumber(paramValue))
                {
                    // NOTHING TO DO
                }
                else
                {
                    paramValue = escape(Gitana.stringify(paramValue, false));
                }

                // apply
                if (url.indexOf("?") > -1)
                {
                    url = url + "&" + paramKey + "=" + paramValue;
                }
                else
                {
                    url = url + "?" + paramKey + "=" + paramValue;
                }
            }

            return this.ajax(method, url, contentType, data, headers, onSuccess, onFailure);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaGet: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, params, "application/json", null, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaDownload: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, params, null, null, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP POST request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPost: function(url, params, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, params, "application/json", jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP POST request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {String} contentType content type being sent
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaUpload: function(url, params, contentType, data, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, params, contentType, data, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP PUT request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPut: function(url, params, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("PUT", url, params, "application/json", jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP DELETE request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} params request parameters
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaDelete: function(url, params, successCallback, failureCallback)
        {
            return this.gitanaRequest("DELETE", url, params, "application/json", null, successCallback, failureCallback);
        },

        getFactory: function()
        {
            return new Gitana.ObjectFactory();
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CHAINING METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Authenticates as the supplied user.
         *
         * A user can either be authenticated using username/password credentials or via an authentication code.
         *
         * Authorization Code flow:
         *
         *   {
         *     "code": "<code>",
         *     "redirectUri": "<redirectUri>"
         *   }

         * Username/password flow:
         *
         *   {
         *     "username": "<username>",
         *     "password": "<password>"
         *   }
         *
         * Implicit flow:
         *
         *   {
         *     "accessToken": "<accessToken>",
         *     "redirectUri": "<redirectUri>"
         *   }
         *
         * Using Gitana Ticket from a cookie:
         *
         *   {
         *     "cookie": true
         *   }
         *
         * Using Gitana Ticket (explicitly provided):
         *
         *   {
         *     "ticket": "<ticket>"
         *   }
         *
         * An authentication failure handler can be passed as the final argument
         *
         * @chained platform
         *
         * @param {Object} settings
         * @param [Function] authentication failure handler
         */
        authenticate: function(settings, authFailureHandler)
        {
            var driver = this;

            // build config
            var config = {
                "code": null,
                "redirectUri": null,
                "username": null,
                "password": null,
                "accessToken": null,
                "ticket": null,
                "cookie": null,
                "ticketMaxAge": null
            };
            Gitana.copyKeepers(config, Gitana.loadDefaultConfig());
            Gitana.copyKeepers(config, settings);

            // build a cluster instance
            var cluster = new Gitana.Cluster(this, {});

            // run with this = platform
            var doAuthenticate = function()
            {
                var platform = this;

                // params to /auth/info
                var authInfoParams = {};
                if (config.ticketMaxAge) {
                    authInfoParams.ticketMaxAge = config.ticketMaxAge;
                }

                // we provide a fallback if no flow type is specified, using "password" flow with guest/guest
                if (!config.code && !config.username && !config.accessToken && !config.cookie && !config.ticket)
                {
                    config.username = "guest";
                    config.password = "guest";
                }

                //
                // authenticate via the authentication flow
                //
                if (config.code)
                {
                    // clear existing cookie and ticket
                    config.authorizationFlow = Gitana.OAuth2Http.AUTHORIZATION_CODE;
                    driver.resetHttp(config);
                    Gitana.deleteCookie("GITANA_TICKET", "/");
                    driver.currentPlatform = null;

                    // fetch the auth info
                    driver.gitanaGet("/auth/info", authInfoParams, function(response) {

                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // store reference to platform
                        driver.currentPlatform = result;

                        // TODO: fix this
                        // kill the JSESSIONID cookie which comes back from the proxy and ties us to a session
                        // on the Gitana server
                        Gitana.deleteCookie("JSESSIONID", "/");

                        // now continue the platform chain after we reload
                        platform.reload();
                        platform.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(platform, http);
                        }

                    });
                }

                //
                // authenticate via password flow
                //
                else if (config.username)
                {
                    // clear existing cookie and ticket
                    config.authorizationFlow = Gitana.OAuth2Http.PASSWORD;
                    driver.resetHttp(config);
                    Gitana.deleteCookie("GITANA_TICKET", "/");
                    driver.currentPlatform = null;

                    // retrieve auth info and plug into the driver
                    driver.gitanaGet("/auth/info", authInfoParams, function(response) {
                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // store reference to platform
                        driver.currentPlatform = result;

                        // TODO: fix this
                        // kill the JSESSIONID cookie which comes back from the proxy and ties us to a session
                        // on the Gitana server
                        Gitana.deleteCookie("JSESSIONID", "/");

                        // now continue the platform chain after we reload
                        platform.reload();
                        platform.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(platform, http);
                        }

                    });
                }

                //
                // authenticate via implicit "token" flow
                //
                else if (config.accessToken)
                {
                    // clear existing cookie and ticket
                    config.authorizationFlow = Gitana.OAuth2Http.TOKEN;
                    driver.resetHttp(config);
                    Gitana.deleteCookie("GITANA_TICKET", "/");
                    driver.currentPlatform = null;

                    // fetch the auth info
                    driver.gitanaGet("/auth/info", authInfoParams, function(response) {

                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // store reference to platform
                        driver.currentPlatform = result;

                        // TODO: fix this
                        // kill the JSESSIONID cookie which comes back from the proxy and ties us to a session
                        // on the Gitana server
                        Gitana.deleteCookie("JSESSIONID", "/");

                        // now continue the platform chain after we reload
                        platform.reload();
                        platform.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(platform, http);
                        }

                    });
                }

                //
                // authenticate using an existing cookie
                //
                else if (config.cookie)
                {
                    // reuse an existing cookie (token flow)
                    config.authorizationFlow = Gitana.OAuth2Http.COOKIE;
                    driver.resetHttp(config);
                    driver.currentPlatform = null;

                    // fetch the auth info
                    driver.gitanaGet("/auth/info", authInfoParams, function(response) {

                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // store reference to platform
                        driver.currentPlatform = result;

                        // TODO: fix this
                        // kill the JSESSIONID cookie which comes back from the proxy and ties us to a session
                        // on the Gitana server
                        Gitana.deleteCookie("JSESSIONID", "/");

                        // now continue the platform chain after we reload
                        platform.reload();
                        platform.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(platform, http);
                        }

                    });

                }

                //
                // authenticate using an explicit gitana ticket
                //
                else if (config.ticket)
                {
                    // reuse an existing cookie (token flow)
                    config.authorizationFlow = Gitana.OAuth2Http.TICKET;
                    driver.resetHttp(config);
                    driver.currentPlatform = null;

                    // fetch the auth info
                    driver.gitanaGet("/auth/info", authInfoParams, function(response) {

                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // store reference to platform
                        driver.currentPlatform = result;

                        // TODO: fix this
                        // kill the JSESSIONID cookie which comes back from the proxy and ties us to a session
                        // on the Gitana server
                        Gitana.deleteCookie("JSESSIONID", "/");

                        // now continue the platform chain after we reload
                        platform.reload();
                        platform.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(platform, http);
                        }

                    });

                }
                else
                {
                    throw new Error("Unsupported authentication flow - you must provide either a username, authorization code or access token");
                }
            };

            // run with this = platform
            var doAutoConfig = function(uri, callback)
            {
                var platform = this;

                // call over to gitana and request auto configuration
                new Gitana.Http().request({
                    "url": "/proxy/pub/driver?uri=" + Gitana.Http.URLEncode(uri),
                    "success": function(response)
                    {
                        var config = JSON.parse(response.text);
                        if (config.clientKey)
                        {
                            var options = {
                                "clientKey": config.clientKey
                            };
                            platform.getDriver().updateOptions(options);

                            var stackInfo = {};
                            if (config.stackId)
                            {
                                stackInfo.id = config.stackId;
                            }
                            if (config.stackDataStores)
                            {
                                stackInfo.datastores = config.stackDataStores;
                            }
                            platform.getDriver().setStackInfo(stackInfo);

                            var applicationInfo = {};
                            if (config.applicationId)
                            {
                                applicationInfo.id = config.applicationId;
                            }
                            platform.getDriver().setApplicationInfo(applicationInfo);
                        }

                        if (callback)
                        {
                            callback.call(platform);
                        }
                    }
                });
            };

            var result = this.getFactory().platform(cluster);
            return Chain(result).then(function() {

                // NOTE: this = platform
                var platform = this;

                if (Gitana.autoConfigUri)
                {
                    doAutoConfig.call(platform, Gitana.autoConfigUri, function() {
                        doAuthenticate.call(platform);
                    });
                }
                else
                {
                    doAuthenticate.call(platform);
                }

                // tell the chain that we'll manually handle calling next()
                return false;
            });
        },

        /**
         * Clears any authentication for the driver.
         */
        clearAuthentication: function()
        {
            if (this.http.clearStorage)
            {
                this.http.clearStorage();
            }

            this.resetHttp();
            Gitana.deleteCookie("GITANA_TICKET", "/");

            this.currentPlatform = null;
        },

        /**
         * Refreshes the authentication access token.
         *
         * @param callback
         */
        refreshAuthentication: function(callback)
        {
            this.http.refresh(function(err) {
                callback(err);
            });
        },

        /**
         * Destructor function, called at the end of the driver instance's lifecycle
         */
        destroy: function()
        {
            this.clearAuthentication();
        }

    });


    //
    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "name": "everyone",
        "type": "GROUP"
    };

    // temporary location for this code
    Gitana.toCopyDependencyChain = function(typedID)
    {
        var array = [];

        if (typedID.getType() == "node")
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getBranch()));
        }
        if (typedID.getType() == "association")
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getBranch()));
        }
        else if (typedID.getType() == "branch")
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getRepository()));
        }
        else if (typedID.getType() == "platform")
        {
            // nothing to do here
        }
        else if (typedID.getType() == "stack")
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getPlatform()));
        }
        else if (typedID.getType() == "project")
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getPlatform()));
        }
        else
        {
            array = array.concat(Gitana.toCopyDependencyChain(typedID.getPlatform()));
        }

        array.push(Gitana.toDependencyObject(typedID));

        return array;
    };

    Gitana.toDependencyObject = function(typedID)
    {
        return {
            "typeId": typedID.getType(),
            "id": typedID.getId()
        };
    };

    Gitana.TypedIDConstants = {};
    Gitana.TypedIDConstants.TYPE_APPLICATION = "application";
    Gitana.TypedIDConstants.TYPE_EMAIL = "email";
    Gitana.TypedIDConstants.TYPE_EMAIL_PROVIDER = "emailprovider";
    Gitana.TypedIDConstants.TYPE_REGISTRATION = "registration";
    Gitana.TypedIDConstants.TYPE_SETTINGS = "settings";

    // cluster
    Gitana.TypedIDConstants.TYPE_CLUSTER = "cluster";
    Gitana.TypedIDConstants.TYPE_JOB = "job";
    Gitana.TypedIDConstants.TYPE_LOG_ENTRY = "logEntry";

    // directory
    Gitana.TypedIDConstants.TYPE_DIRECTORY = "directory";
    Gitana.TypedIDConstants.TYPE_IDENTITY = "identity";
    Gitana.TypedIDConstants.TYPE_CONNECTION = "connection";

    // domain
    Gitana.TypedIDConstants.TYPE_DOMAIN = "domain";
    Gitana.TypedIDConstants.TYPE_DOMAIN_GROUP = "group";
    Gitana.TypedIDConstants.TYPE_DOMAIN_USER = "user";

    // platform
    Gitana.TypedIDConstants.TYPE_PLATFORM = "platform";
    Gitana.TypedIDConstants.TYPE_AUTHENTICATION_GRANT = "authenticationGrant";
    Gitana.TypedIDConstants.TYPE_BILLING_PROVIDERS_CONFIGURATION = "billingProviderConfiguration";
    Gitana.TypedIDConstants.TYPE_CLIENT = "client";
    Gitana.TypedIDConstants.TYPE_STACK = "stack";
    Gitana.TypedIDConstants.TYPE_PROJECT = "project";

    // registrar
    Gitana.TypedIDConstants.TYPE_REGISTRAR = "registrar";
    Gitana.TypedIDConstants.TYPE_METER = "meter";
    Gitana.TypedIDConstants.TYPE_PLAN = "plan";
    Gitana.TypedIDConstants.TYPE_TENANT = "tenant";

    // repository
    Gitana.TypedIDConstants.TYPE_REPOSITORY = "repository";
    Gitana.TypedIDConstants.TYPE_ASSOCIATION = "association";
    Gitana.TypedIDConstants.TYPE_BRANCH = "branch";
    Gitana.TypedIDConstants.TYPE_CHANGESET = "changeset";
    Gitana.TypedIDConstants.TYPE_NODE = "node";

    // vault
    Gitana.TypedIDConstants.TYPE_VAULT = "vault";
    Gitana.TypedIDConstants.TYPE_ARCHIVE = "archive";

    // warehouse
    Gitana.TypedIDConstants.TYPE_WAREHOUSE = "warehouse";
    Gitana.TypedIDConstants.TYPE_INTERACTION = "interaction";
    Gitana.TypedIDConstants.TYPE_INTERACTION_APPLICATION = "interactionApplication";
    Gitana.TypedIDConstants.TYPE_INTERACTION_NODE = "interactionNode";
    Gitana.TypedIDConstants.TYPE_INTERACTION_PAGE = "interactionPage";
    Gitana.TypedIDConstants.TYPE_INTERACTION_REPORT = "interactionReport";
    Gitana.TypedIDConstants.TYPE_INTERACTION_REPORT_ENTRY = "interactionReportEntry";
    Gitana.TypedIDConstants.TYPE_INTERACTION_SESSION = "interactionSession";
    Gitana.TypedIDConstants.TYPE_INTERACTION_USER = "interactionUser";

    Gitana.TypedIDConstants.TYPE_INTERACTION_CONTINENT = "interactionContinent";
    Gitana.TypedIDConstants.TYPE_INTERACTION_COUNTRY = "interactionCountry";
    Gitana.TypedIDConstants.TYPE_INTERACTION_CITY = "interactionCity";
    Gitana.TypedIDConstants.TYPE_INTERACTION_REGION = "interactionRegion";
    Gitana.TypedIDConstants.TYPE_INTERACTION_POSTALCODE = "interactionPostalCode";
    Gitana.TypedIDConstants.TYPE_INTERACTION_USERAGENT = "interactionUserAgent";
    Gitana.TypedIDConstants.TYPE_INTERACTION_OPERATINGSYSTEM = "interactionOperatingSystem";
    Gitana.TypedIDConstants.TYPE_INTERACTION_DEVICE = "interactionDevice";

    // web host
    Gitana.TypedIDConstants.TYPE_WEB_HOST = "webhost";
    Gitana.TypedIDConstants.TYPE_AUTO_CLIENT_MAPPING = "autoClientMapping";
    Gitana.TypedIDConstants.TYPE_TRUSTED_DOMAIN_MAPPING = "trustedDomainMapping";
    Gitana.TypedIDConstants.TYPE_DEPLOYED_APPLICATION = "deployedApplication";

    Gitana.handleJobCompletion = function(chain, cluster, jobId, synchronous)
    {
        var jobFinalizer = function() {

            return Chain(cluster).readJob(jobId).then(function() {

                if (!synchronous || (synchronous && (this.getState() == "FINISHED" || this.getState() == "ERROR")))
                {
                    chain.loadFrom(this);
                    chain.next();
                }
                else
                {
                    // reset timeout
                    window.setTimeout(jobFinalizer, 250);
                }

            });
        };

        // set timeout
        window.setTimeout(jobFinalizer, 250);
    };

    /** Extension point for loading default config for server-side containers **/
    Gitana.loadDefaultConfig = function()
    {
    };

    /**
     * Simple in-memory cache implementation for use by-default by the driver.
     *
     * @return {Function}
     * @constructor
     */
    Gitana.MemoryCache = function()
    {
        var cache = {};

        return function(k, v)
        {
            if (!Gitana.isUndefined(v)) {
                if (v) {
                    cache[k] = v;
                }
                else {
                    delete cache[k];
                }
            }
            return cache[k];
        };
    };


    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // PLATFORM CACHE
    //
    //

    // extension point - override with other implementations
    Gitana.PLATFORM_CACHE = Gitana.MemoryCache();

    /**
     * Connects to a Gitana platform.
     *
     * @param config
     * @param [callback] optional callback function that gets called once the server has been connected to.  If no
     *                   "application" config parameter is present, then the callback function is called with the this
     *                   context set to the platform.  If an "application" config parameter is present, then the stack
     *                   for the application is loaded and references are resolved and the this context will be the
     *                   app helper instance.  This callback also acts as an error handler for any authentication issues.
     *                   If an auth error happens, the err is passed to the callback as the first and only argument.
     *
     * @return {*}
     */
    Gitana.connect = function(config, callback)
    {
        // allow for no config, callback-only
        if (Gitana.isFunction(config)) {
            callback = config;
            config = null;
        }

        var missingConfig = false;

        if (!config) {
            config = {};
            missingConfig = true;
        }

        if (Gitana.isString(config)) {
            config = {"key": config};
        }

        // by default, set invalidatePlatformCache to false
        if (typeof(config.invalidatePlatformCache) == "undefined")
        {
            config.invalidatePlatformCache = false;
        }

        // if no config key specified, we can generate one...
        if (!config.key)
        {
            // "ticket" authentication - key = ticket
            if (config.ticket) {
                config.key = config.ticket;
            }
            else if (config.clientKey && config.username) {
                config.key = config.clientKey + ":" + config.username;
            }
            else if (missingConfig)
            {
                // if no config provided, use "default" key
                config.key = "default";
            }
        }

        // default to load app helper if not defined
        if (typeof(config.loadAppHelper) == "undefined")
        {
            config.loadAppHelper = true;
        }

        // this gets called once the platform is drawn from cache or created
        // fires the callback and passes in the platform or the app helper
        var setupContext = function(platformCacheKey)
        {
            // NOTE: this == platform

            // if their configuration contains the "application" setting, then auto-load the app() context
            // note that config.application could be undefined (we require explicit NULL here for copyKeepers)
            if (config.loadAppHelper)
            {
                var appConfig = {
                    "application": (config.application ? config.application: null)
                };
                Gitana.copyKeepers(appConfig, Gitana.loadDefaultConfig());
                Gitana.copyKeepers(appConfig, this.getDriver().getOriginalConfiguration());
                if (appConfig.application) {

                    var appSettings = {
                        "application": appConfig.application
                    };
                    if (platformCacheKey) {
                        appSettings.appCacheKey = platformCacheKey + "_" + appConfig.application
                    }
                    this.app(appSettings, function(err) {
                        if (callback) {
                            // NOTE: this == app helper
                            callback.call(this, err);
                        }
                    });
                }
                else {
                    if (callback) {
                        callback.call(this);
                    }
                }
            }
            else
            {
                if (callback) {
                    callback.call(this);
                }
            }
        };

        // support for invalidatePlatformCache
        if (config.key && config.invalidatePlatformCache)
        {
            Gitana.disconnect(config.key);
        }

        // either retrieve platform from cache or authenticate
        var platform = null;
        if (config.key) {
            platform = Gitana.PLATFORM_CACHE(config.key);
        }
        if (platform)
        {
            // platform already loaded

            // spawn off a new copy for thread safety
            platform = Chain(new Gitana.Platform(platform.getCluster(), platform));
            setupContext.call(platform, config.key);
            return platform;
        }

        // if they didn't provide a config and made it this far, then lets assume a cookie based config?
        if (missingConfig)
        {
            config["cookie"] = true;
        }

        // load it up
        return new Gitana(config).authenticate(config, function(err) {

            if (callback) {
                callback.call(this, err);
            }

        }).then(function() {

            // NOTE: this == platform

            // cache
            if (config.key) {
                Gitana.PLATFORM_CACHE(config.key, this);
            }

            // always cache on ticket as well
            var ticket = this.getDriver().getAuthInfo().getTicket();
            if (ticket) {
                Gitana.PLATFORM_CACHE(ticket, this);
            }

            setupContext.call(this, config.key);

        });
    };

    /**
     * Disconnects a platform from the cache.
     *
     * @param key
     */
    Gitana.disconnect = function(key)
    {
        if (!key) {
            key = "default";
        }

        var platform = Gitana.PLATFORM_CACHE(key);
        if (platform)
        {
            var badKeys = [];
            for (var k in Gitana.APPS)
            {
                if (k.indexOf(key + "_") == 0)
                {
                    badKeys.push(k);
                }
            }
            for (var i = 0; i < badKeys.length; i++)
            {
                delete Gitana.APPS[badKeys[i]];
            }

            var ticket = platform.getDriver().getAuthInfo().getTicket();
            if (ticket)
            {
                Gitana.PLATFORM_CACHE(ticket, null);
            }

            Gitana.PLATFORM_CACHE(key, null);

            platform.getDriver().destroy();
        }
    };

    // holds a total count of Ajax requests originated from the driver
    Gitana.requestCount = 0;

    // version of the driver
    Gitana.VERSION = "1.0.8";

    // allow for optional global assignment
    // TODO: until we clean up the "window" variable reliance, we have to always set onto window again
    // TODO: to support loading within NodeJS
    //if (window && !window.Gitana) {
    if (window) {
        window.Gitana = Gitana;
    }

    // insertion point for on-load adjustments (cloudcms-net server)
    Gitana.__INSERT_MARKER = null;

})(window);