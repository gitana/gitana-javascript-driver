(function(window) {
    var VERSION = "0.1.0";
    var _makeArray = function(nonarray) {
        return Array.prototype.slice.call(nonarray);
    };
    var _stringify = function(object, pretty) {

        var val = null;
        if (pretty)
        {
            val = JSON.stringify(object, null, "  ");
        }
        else
        {
            val = JSON.stringify(object);
        }

        return val;
    };

    var _isFunction = function(obj) {
        return Object.prototype.toString.call(obj) === "[object Function]";
    };

    var _startsWith = function(text, prefix) {
		return text.substr(0, prefix.length) === prefix;
	};

    var _initXMLHttpClient = function() {
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

    /**
     * Implementation of Gitana Ajax Support
     * Assumes that communication is always JSON
     */
    var _ajax = function (method, url, jsonData, successCallback, failureCallback, headers) {
        var http = _initXMLHttpClient();

        // treat the method
        if (method == null) {
            method = "get";
        }
        method = method.toLowerCase();

        // create the connection
        http.open(method, url, true, "admin", "admin");

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
            for each (key in headers) {
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
                    if (successCallback && _isFunction(successCallback)) {
                        successCallback(result);
                    }
                }
                else {
                    if (failureCallback && _isFunction(failureCallback)) {
                        failureCallback(http);
                    }
                }
            }
        };

        var toSend = null;
        if (jsonData != null) {
            // make a copy of the data and remove any methods
            var d = { };
            Gitana.copyInto(d, jsonData);

            // stringify
            toSend = _stringify(d);
        }
        http.send(toSend);

        return http;
    };


    /************************************************/
    /**                                            **/
    /** GITANA DRIVER                              **/
    /**                                            **/
    /************************************************/

    // var Gitana = new Gitana(serverURL)
    // var Gitana = new Gitana(serverURL, ticket);

    var Gitana = function(serverURL, ticket) {
        var _this = this;

        if (serverURL) {
            this.serverURL = serverURL;
        }
        else {
            this.serverURL = "/proxy";
        }

        if (ticket) {
            this.ticket = ticket;
        }


        /************************************************/
        /**                                            **/
        /** PRIVATE METHODS                            **/
        /**                                            **/
        /************************************************/

        // workhorse method for communicating with Gitana
        this.gitanaRequest = function(method, url, jsonData, successCallback, failureCallback) {
            // make sure we compute the real url
            if (_startsWith(url, "/")) {
                url = this.serverURL + url;
            }

            var onSuccess = function(json) {
                successCallback(new Gitana.Object.Response(json));
            };

            var onFailure = function(http) {
                failureCallback(http);
            };

            var headers = { };
            if (_this.ticket) {
                headers["GITANA_TICKET"] = _this.ticket;
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

            return _ajax(method, url, jsonData, onSuccess, onFailure, headers);
        };

        this.gitanaGet = function(url, successCallback, failureCallback) {
            return _this.gitanaRequest("GET", url, null, successCallback, failureCallback);
        };

        this.gitanaPost = function(url, jsonData, successCallback, failureCallback) {
            return _this.gitanaRequest("POST", url, jsonData, successCallback, failureCallback);
        };

        this.gitanaPut = function(url, jsonData, successCallback, failureCallback) {
            return _this.gitanaRequest("PUT", url, jsonData, successCallback, failureCallback);
        };

        this.gitanaDelete = function(url, successCallback, failureCallback) {
            return _this.gitanaRequest("DELETE", url, null, successCallback, failureCallback);
        };


        // assign api members
        this.security = function() {
            return new Gitana.Service.Security(_this);
        };

        this.repositories = function() {
            return new Gitana.Service.Repositories(_this);
        };

    };


    /************************************************/
    /**                                            **/
    /** STATIC METHODS                             **/
    /**                                            **/
    /************************************************/

    Gitana.ajaxErrorHandler = function(httpObject) {
        alert("Error: " + httpObject.status);
    };

    Gitana.version = VERSION;
    Gitana.stringify = _stringify;
    Gitana.makeArray = _makeArray;
    Gitana.isFunction = _isFunction;

    Gitana.copyInto = function(target, source) {
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                target[i] = source[i];
            }
        }
    };

    Gitana.Object = { };
    Gitana.Service = { };

    window.Gitana = Gitana;

})(window);
