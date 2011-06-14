(function(window)
{
    Gitana = Base.extend(
    /** @lends Gitana.prototype */
    {
        /**
         * @constructs
         * @augments Base
         *
         * @class Gitana
         *
         * Configuration options should look like:
         *
         * {
         *    "serverURL": {String} base path to the Gitana server (i.e. "http://server:port")
         *                 If no value provided, then "/proxy" is assumed
         *    "ticket": {String} ticket,
         *    "ticketAsParameter": {boolean},
         *    "locale": {String}
         * }
         */
        constructor: function(config)
        {
            this.VERSION = "0.1.0";

            // copy any configuration properties onto the gitana object
            Gitana.copyInto(this, config);

            // supply any defaults
            if (!this.serverURL)
            {
                this.serverURL = "/proxy";
            }

            /**
             * Declare any priviledged methods
             */
            this.initXMLHttpClient = function() {
                var http = null;
                try {

                    if (Gitana.isTitanium())
                    {
                        http = Titanium.Network.createHTTPClient();
                    }
                    else
                    {
                        // assume browser
                        http = new XMLHttpRequest();
                    }
                }
                catch (e) {
                    // IE (?!)
                    var success = false;
                    var XMLHTTP_IDS = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];

                    for (var i = 0; i < XMLHTTP_IDS.length && !success; i++) {
                        try {
                            success = true;
                            http = new ActiveXObject(XMLHTTP_IDS[i]);
                        }
                        catch (e) {
                        }
                    }

                    if (!success) {
                        throw new Error('Unable to create XMLHttpRequest!');
                    }
                }

                return http;
            };
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

            var http = this.initXMLHttpClient();

            // treat the method
            if (method == null) {
                method = "get";
            }
            method = method.toLowerCase();

            // flags
            var json = false;
            if (contentType == "application/json")
            {
                json = true;
            }

            // error checking
            if ( (method == "post" || method == "put") && (!contentType))
            {
                Gitana.debug("Performing method: " + method + " but missing content type");
                return;
            }

            // create the connection
            http.open(method, url, true);

            // slightly different behaviors here based on method
            if (method == "get") {
            } else if (method == "post") {
                http.setRequestHeader("Content-Type", contentType);
            } else if (method == "put") {
                http.setRequestHeader("Content-Type", contentType);
            } else if (method == "delete") {
            }

            // apply any headers
            if (headers) {
                for (key in headers) {
                    http.setRequestHeader(key, headers[key]);
                }
            }

            // detect when document is loaded
            http.onreadystatechange = function () {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        var result = "";
                        if (http.responseText) {
                            result = http.responseText;
                        }

                        // if json comes back, convert into json object
                        if (json)
                        {
                            //\n's in JSON string, when evaluated will create errors in IE
                            result = result.replace(/[\n\r]/g, "");
                            result = eval('(' + result + ')');
                        }

                        //Give the data to the callback function.
                        if (successCallback && Gitana.isFunction(successCallback)) {
                            successCallback(result);
                        }
                    }
                    else {
                        if (failureCallback && Gitana.isFunction(failureCallback)) {
                            failureCallback(http);
                        }
                    }
                }
            };

            var toSend = data;

            // special handling for json
            if (json)
            {
                if (data != null)
                {
                    var d = {};
                    Gitana.copyInto(d, data);

                    // stringify
                    toSend = Gitana.stringify(d);
                }
            }
            http.send(toSend);

            return http;
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
                url = this.serverURL + url;
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
                        arg = new Gitana.Response(data);
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

            // adjust url to include "full" as well as "metadata"
            params["metadata"] = "true";
            params["full"] = "true";

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
         * Authenticates the driver as the given user.
         * If authenticated, a ticket is returned and stored in the driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] authentication failure handler
         */
        authenticate: function(username, password, authFailureHandler)
        {
            var driver = this;

            var result = this.getFactory().server(this);
            return Chain(result).then(function() {

                var chain = this;

                // authenticate
                driver.gitanaGet("/security/login", {"u": username, "p": password}, function(response) {

                    // store ticket and username onto new driver
                    driver.ticket = response.ticket;
                    driver.authenticatedUsername = username;

                    // write cookie into document (if applicable)
                    Gitana.writeCookie("GITANA_TICKET", response.ticket, "/");

                    // manually handle next()
                    chain.next();
                }, function(http) {

                    // if authentication fails, respond to custom auth failure handler
                    if (authFailureHandler)
                    {
                        authFailureHandler.call(chain, http);
                    }

                });

                // tell the chain that we'll manually handle calling next()
                return false;
            });
        },

        /**
         * Clears any authentication for the driver.
         */
        clearAuthentication: function()
        {
            this.ticket = null;

            Gitana.deleteCookie("GITANA_TICKET", "/");
        }

    });

    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

    window.Gitana = Gitana;

})(window);