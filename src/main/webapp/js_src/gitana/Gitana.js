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
         *    "consumerKey": {String} the oauth consumer key,
         *    "consumerSecret": [String] optional consumer secret (not recommended for web apps),
         *    "proxyURI": [String] the relative URI path to the proxy (assumed to be "/proxy"),
         *    "locale": [String] optional locale (assumed to be en_US),
         *    "opendriver": [Boolean] whether to enable opendriver mode
         * }
         */
        constructor: function(config)
        {
            var self = this;

            // version of the driver
            this.VERSION = "0.1.1";

            // defaults
            this.consumerKey = null;
            this.consumerSecret = null;

            // copy any configuration properties onto the gitana object
            Gitana.copyInto(this, config);

            // supply any defaults
            if (!this.proxyURI)
            {
                this.proxyURI = "/proxy";
            }

            // whether we're in "opendriver" mode
            var opendriver = false;

            // set up our oAuth connection
            var options = {
                consumerKey: this.consumerKey
            };
            if (this.consumerSecret)
            {
                options.consumerSecret = this.consumerSecret
            }
            else
            {
                options.callbackUrl = "opendriver";
                opendriver = true;
            }

            this.isOpenDriver = function()
            {
                return opendriver;
            };

            this.resetOauth = function()
            {
                self.oauth = new OAuth(options);
            };
            this.resetOauth();

            this.setAuthInfo = function(authInfo)
            {
                this.authInfo = authInfo;
            };
        },

        /**
         * Sets the authentication info
         */
        getAuthInfo: function()
        {
            return this.authInfo;
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

                    if (json.stacktrace)
                    {
                        stacktrace = json.stacktrace;
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
                method = "get";
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
                if (data != null)
                {
                    // stringify
                    toSend = Gitana.stringify(data);
                }
            }

            // NOTE: we have to pad the URL in case it is relative here
            if (url.substring(0,1) == "/")
            {
                var u = window.location.protocol + "//" + window.location.host;
                if (window.location.host.indexOf(":") == -1)
                {
                    u += ":" + window.location.port;
                }
                url = u + url;
            }

            var config = {
                "method": method,
                "url": url,
                "data": toSend,
                "headers": headers,
                "success": successCallback,
                "failure": failureCallback,
                "proxyURI": this.proxyURI
            };

            this.oauth.request(config);

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
                url = this.proxyURI + url;
            }

            if (!failureCallback)
            {
                failureCallback = this.defaultFailureCallback;
            }

            var onSuccess = function(data)
            {
                if (successCallback)
                {
                    var arg = data;
                    if (contentType == "application/json")
                    {
                        arg = new Gitana.Response(JSON.parse(data.text));
                    }
                    successCallback(arg);
                }
            };

            var onFailure = function(http)
            {
                if (failureCallback)
                {
                    failureCallback(http);
                }
            };

            var headers = { };
            if (this.ticket) {
                headers["GITANA_TICKET"] = this.ticket;
            }
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

            // add in ticket if we're supposed to
            if (this.ticket && this.ticketAsParameter)
            {
                params["ticket"] = this.ticket;
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
            var onSuccess = function(http)
            {
                if (successCallback)
                {
                    successCallback(http.text);
                }
            };

            return this.gitanaRequest("GET", url, params, null, null, onSuccess, failureCallback);
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
         * A user can either be authenticated via username/password or via their access token combination.
         *
         * Username/password:
         *
         *   {
         *     "username": "<username>",
         *     "password": "<password>"
         *   }
         *
         * Access token combination:
         *
         *   {
         *     "accessTokenKey": "<accessTokenKey>",
         *     "accessTokenSecret": "<accessTokenSecret>"
         *   }
         *
         * An authentication failure handler can be passed as the final argument
         *
         * @param {Object} configuration
         * @param [Function] authentication failure handler
         */
        authenticate: function(config, authFailureHandler)
        {
            var driver = this;

            var result = this.getFactory().platform(this, {
                "_doc": "default"
            });
            return Chain(result).then(function() {

                var chain = this;


                //
                // authenticate via access token key (maybe with secret)
                //
                if (config.accessTokenKey)
                {
                    // we can either authenticate using full oauth (access token key/secret pair)
                    // or using the "open driver" authentication scheme

                    // clear existing cookie and ticket
                    driver.resetOauth();
                    Gitana.deleteCookie("GITANA_TICKET", "/");
                    Gitana.deleteCookie("opendriver", "/");
                    driver.ticket = null;

                    if (config.accessTokenSecret)
                    {
                        // authenticate via access token key / secret
                        driver.oauth.setAccessToken(config.accessTokenKey, config.accessTokenSecret);

                        // ensure we're not in "opendriver" mode
                        if (driver.isOpenDriver())
                        {
                            alert("Cannot proceed with token secret in opendriver mode");
                        }
                    }
                    else
                    {
                        // authenticate via open-driver
                        driver.oauth.setAccessToken([config.accessTokenKey]);

                        // ensure that we are in "opendriver" mode
                        if (!driver.isOpenDriver())
                        {
                            alert("Must be in opendriver mode in order to use access token key only authentication");
                        }
                    }

                    // fetch the auth info
                    driver.gitanaGet("/auth/info", {}, function(response) {

                        var authInfo = new Gitana.AuthInfo(response);
                        driver.setAuthInfo(authInfo);

                        // manually handle next()
                        chain.next();

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(chain, http);
                        }

                    });
                }

                //
                // authenticate via username/password
                //
                else
                {
                    // authenticate via username and password
                    // note, this is a pretty bad idea unless you're behind HTTPS and even then, your username
                    // and password could end up out in the open via the source code

                    // clear existing cookie and ticket
                    driver.resetOauth();
                    Gitana.deleteCookie("GITANA_TICKET", "/");
                    Gitana.deleteCookie("opendriver", "/");
                    driver.ticket = null;

                    // set a special access token which indicates we'll drive user auth from a ticket
                    driver.oauth.setAccessToken(["ticket"]);

                    // log in using username/password authetnication
                    driver.gitanaGet("/auth/login", {"u": config.username, "p": config.password}, function(response) {

                        // write cookie into document (if applicable)
                        Gitana.writeCookie("GITANA_TICKET", response.ticket, "/");

                        // write ticket onto driver object as well
                        driver.ticket = response.ticket;

                        // retrieve auth info and plug into the driver
                        driver.gitanaGet("/auth/info", {}, function(response) {

                            var authInfo = new Gitana.AuthInfo(response);
                            driver.setAuthInfo(authInfo);

                            // manually handle next()
                            chain.next();

                        });

                        return false;

                    }, function(http) {

                        // if authentication fails, respond to custom auth failure handler
                        if (authFailureHandler)
                        {
                            authFailureHandler.call(chain, http);
                        }

                    });
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
            this.resetOauth();
            Gitana.deleteCookie("opendriver", "/");
            Gitana.deleteCookie("GITANA_TICKET", "/");
            this.ticket = null;
        }

    });

    //
    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "name": "everyone",
        "type": "GROUP"
    };

    window.Gitana = Gitana;

})(window);