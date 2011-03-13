(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Gitana Javascript Driver
     */
    Gitana.Driver = Gitana.Abstract.extend({

        constructor: function(serverURL, ticket)
        {
            this.base();

            // public properties
            this.VERSION = "0.1.0";

            // members
            if (serverURL) {
                this.serverURL = serverURL;
            }
            else {
                this.serverURL = "/proxy";
            }

            this.ticket = null;
            if (ticket) {
                this.ticket = ticket;
            }

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

        setLocale: function(locale)
        {
            this.locale = locale;
        },

        getLocale: function()
        {
            return this.locale;
        },


        /**
         * Ajax communication method with a remote server.
         * 
         * @param method
         * @param url
         * @param jsonData
         * @param successCallback
         * @param failureCallback
         * @param headers
         */
        ajax: function(method, url, jsonData, successCallback, failureCallback, headers)
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
         * Makes a request to the Gitana server.
         *
         * @param method
         * @param url
         * @param jsonData
         * @param successCallback
         * @param failureCallback
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

            return this.ajax(method, url, jsonData, onSuccess, onFailure, headers);
        },

        /**
         * Makes a GET request to the Gitana server.
         *
         * @param url
         * @param successCallback
         * @param failureCallback
         */
        gitanaGet: function(url, successCallback, failureCallback)
        {
            return this.gitanaRequest("GET", url, null, successCallback, failureCallback);
        },

        /**
         * Makes a POST request to the Gitana server.
         *
         * @param url
         * @param jsonData
         * @param successCallback
         * @param failureCallback
         */
        gitanaPost: function(url, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("POST", url, jsonData, successCallback, failureCallback);
        },

        /**
         * Makes a PUT request to the Gitana server.
         *
         * @param url
         * @param jsonData
         * @param successCallback
         * @param failureCallback
         */
        gitanaPut: function(url, jsonData, successCallback, failureCallback)
        {
            return this.gitanaRequest("PUT", url, jsonData, successCallback, failureCallback);
        },

        /**
         * Makes a DELETE request to the Gitana server.
         * 
         * @param url
         * @param successCallback
         * @param failureCallback
         */
        gitanaDelete: function(url, successCallback, failureCallback)
        {
            return this.gitanaRequest("DELETE", url, null, successCallback, failureCallback);
        },

        /**
         * Retrieves the repository API
         */
        repositories: function()
        {
            return new Gitana.Repositories(this);
        },

        /**
         * Retrieves the security API
         */
        security: function()
        {
            return new Gitana.Security(this);
        }

    });

})(window);