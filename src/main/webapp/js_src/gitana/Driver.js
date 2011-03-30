(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Driver = Gitana.Abstract.extend(
    /** @lends Gitana.Driver.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Abstract
         *
         * @class Gitana Driver
         *
         * @param {String} [serverURL] Base path to the Gitana Server (i.e. "http://server:port").  If no value is provided, the Cloud CMS API server is assumed (""http://api.cloudcms.com").
         * @param {String} [ticket] The Gitana authentication ticket
         */
        constructor: function(serverURL, ticket)
        {
            this.base();

            // public properties
            this.VERSION = "0.1.0";

            // members
            if (serverURL)
            {
                this.serverURL = serverURL;
            }
            else
            {
                this.serverURL = "/proxy";
            }

            this.ticket = null;
            if (ticket) {
                this.ticket = ticket;
            }

            // node factory
            var nf = new Gitana.NodeFactory();
            this.getNf = function()
            {
                return nf;
            };

            /**
             * Declare any priviledged methods
             */
            this.initXMLHttpClient = function() {
                var http = null;
                try {
                    // Mozilla/Safari/IE7 (normal browsers)
                    http = new XMLHttpRequest();
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
         * @param {Object} [jsonData] In the case of a payload carrying request (i.e. not GET), the JSON to plug into the payload.
         * @param {Object} [headers] A key/value map of headers to place into the request.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        ajax: function(method, url, jsonData, headers, successCallback, failureCallback)
        {
            var _this = this;
            
            var http = this.initXMLHttpClient();

            // treat the method
            if (method == null) {
                method = "get";
            }
            method = method.toLowerCase();

            // create the connection
            http.open(method, url, true);

            // slightly different behaviors here based on method
            if (method == "get") {
            } else if (method == "post") {
                http.setRequestHeader("Content-Type", "application/json");
            } else if (method == "put") {
                http.setRequestHeader("Content-Type", "application/json");
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

                        //\n's in JSON string, when evaluated will create errors in IE
                        result = result.replace(/[\n\r]/g, "");
                        result = eval('(' + result + ')');

                        //Give the data to the callback function.
                        if (successCallback && _this.isFunction(successCallback)) {
                            successCallback(result);
                        }
                    }
                    else {
                        if (failureCallback && _this.isFunction(failureCallback)) {
                            failureCallback(http);
                        }
                    }
                }
            };

            var toSend = null;
            if (jsonData != null) {
                // make a copy of the data and remove any methods
                var d = { };
                this.copyInto(d, jsonData);

                // stringify
                toSend = this.buildString(d);
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
         * @param {Object} [jsonData] In the case of a payload carrying request (i.e. not GET), the JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaRequest: function(method, url, jsonData, successCallback, failureCallback)
        {
            // make sure we compute the real url
            if (this.startsWith(url, "/")) {
                url = this.serverURL + url;
            }

            var onSuccess = function(json) {
                successCallback(new Gitana.Response(json));
            };

            var onFailure = function(http) {
                failureCallback(http);
            };

            var headers = { };
            if (this.ticket) {
                headers["GITANA_TICKET"] = this.ticket;
            }
            if (this.locale) {
                headers["accept-language"] = this.locale;
            }

            // adjust url to include "full" as well as "metadata"
            if (url.indexOf("?") > -1)
            {
                url = url + "&metadata=true&full=true";
            }
            else
            {
                url = url + "?metadata=true&full=true";
            }

            return this.ajax(method, url, jsonData, headers, onSuccess, onFailure);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaGet: function(url, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, null, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP GET request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPost: function(url, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP PUT request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Object} [jsonData] The JSON to plug into the payload.
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaPut: function(url, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("PUT", url, jsonData, successCallback, failureCallback);
        },

        /**
         * Sends an HTTP DELETE request to the Gitana server.
         *
         * @public
         *
         * @param {String} url Either a full URL (i.e. "http://server:port/uri") or a URI against the driver's server URL (i.e. /repositories/...)
         * @param {Function} [successCallback] The function to call if the operation succeeds.
         * @param {Function} [failureCallback] The function to call if the operation fails.
         */
        gitanaDelete: function(url, successCallback, failureCallback)
        {
            return this.gitanaRequest("DELETE", url, null, successCallback, failureCallback);
        },

        /**
         * Acquires a handle to the Repositories API for this driver.
         *
         * @returns {Gitana.Repositories} Repositories API
         */
        repositories: function()
        {
            return new Gitana.Repositories(this);
        },

        /**
         * Acquires a handle to the Security API for this driver.
         *
         * @returns {Gitana.Security} Security API
         */
        security: function()
        {
            return new Gitana.Security(this);
        },

        /**
         * Retrieves the users API
         *
         * @public
         *
         * @returns {Gitana.Users} Users API
         */
        users: function()
        {
            return new Gitana.Users(this);
        },

        /**
         * Retrieves the groups API
         *
         * @public
         *
         * @returns {Gitana.Groups} Groups API
         */
        groups: function()
        {
            return new Gitana.Groups(this);
        },

        /**
         * Acquires a handle to the Node Factory for this driver.
         *
         * @returns {Gitana.NodeFactory} Node Factory
         */
        nodeFactory: function()
        {
            return this.getNf();
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // AUTHORITY METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back the authorities that the given principal has against the server.
         *
         * @param {Gitana.Principal} principal the principal
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        listAuthorities: function(principal, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/authorities", principal, onSuccess, onFailure);
        },

        /**
         * Checks whether the given principal has an authority against the server.
         *
         * @param {Gitana.Principal} principal the principal
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        checkAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(authorities)
            {
                var has = false;

                for (var i = 0; i < authorities.length; i++)
                {
                    if (authorities[i] == authorityId)
                    {
                        has = true;
                        break;
                    }
                }

                successCallback(has);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.listAuthorities(principal, onSuccess, onFailure);
        },

        /**
         * Grants an authority for a principal against the server.
         *
         * @param {Gitana.Principal} principal the principal
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        grantAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/authorities/" + authorityId + "/grant", principal, onSuccess, onFailure);
        },

        /**
         * Revokes an authority for a principal against the server.
         *
         * @param {Gitana.Principal} principal the principal
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/authorities/" + authorityId + "/revoke", principal, onSuccess, onFailure);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @param {Gitana.Principal} principal the principal
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAllAuthorities: function(principal, successCallback, failureCallback)
        {
            this.revokeAuthority(principal, "all", successCallback, failureCallback);
        }

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF AUTHORITY METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

    });


    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

})(window);