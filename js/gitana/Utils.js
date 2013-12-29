(function(window)
{
    Gitana.uniqueIdCounter = 0;

    /**
     * Builds an array from javascript method arguments.
     *
     * @inner
     *
     * @param {arguments} arguments
     *
     * @returns {Array} an array
     */
    Gitana.makeArray = function(args) {
        return Array.prototype.slice.call(args);
    };

    /**
     * Serializes a object into a JSON string and optionally makes it pretty by indenting.
     *
     * @inner
     *
     * @param {Object} object The javascript object.
     * @param {Boolean} pretty Whether the resulting string should have indentation.
     *
     * @returns {String} string
     */
    Gitana.stringify = function(object, pretty) {

        var val = null;
        if (object)
        {
            if (pretty)
            {
                val = JSON.stringify(object, null, "  ");
            }
            else
            {
                val = JSON.stringify(object);
            }
        }

        return val;
    };

    /**
     * Determines whether the given argument is a String.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a String
     */
    Gitana.isString = function( arg ) {
        return (typeof arg == "string");
    };

    /**
     * Determines whether the given argument is a Number.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Number
     */
    Gitana.isNumber = function( arg ) {
        return (typeof arg == "number");
    };

    /**
     * Determines whether the given argument is a Boolean.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Boolean
     */
    Gitana.isBoolean = function( arg ) {
        return (typeof arg == "boolean");
    };

    /**
     * Determines whether the given argument is a Function.
     *
     * @inner
     *
     * @param arg argument
     *
     * @returns {Boolean} whether it is a Function
     */
    Gitana.isFunction = function(arg) {
        return Object.prototype.toString.call(arg) === "[object Function]";
    };

    /**
     * Determines whether a bit of text starts with a given prefix.
     *
     * @inner
     *
     * @param {String} text A bit of text.
     * @param {String} prefix The prefix.
     *
     * @returns {Boolean} whether the text starts with the prefix.
     */
    Gitana.startsWith = function(text, prefix) {
        return text.substr(0, prefix.length) === prefix;
    };

    /**
     * Copies the members of the source object into the target object.
     * This includes both properties and functions from the source object.
     *
     * @inner
     *
     * @param {Object} target Target object.
     * @param {Object} source Source object.
     */
    Gitana.copyInto = function(target, source) {
        for (var i in source) {
            if (source.hasOwnProperty(i) && !this.isFunction(source[i])) {
                target[i] = source[i];
            }
        }
    };

    /**
     * Deletes any owned properties of the given object.  If specified, owned functions will also be deleted.
     *
     * @inner
     *
     * @param object {Object} object
     */
    Gitana.deleteProperties = function(object, deleteFunctions) {
        var keys = [];
        for (var k in object) { keys.push(k); }

        for (var i = 0; i < keys.length; i++)
        {
            var key = keys[i];

            if (object.hasOwnProperty(key)) {
                if (!Gitana.isFunction(object[key]) || (deleteFunctions && Gitana.isFunction(object[key]))) {
                    delete object[key];
                }
            }
        }
    };


    /**
     * Stamps the functions and properties from the source object to the target object.
     *
     * @inner
     *
     * @param {Object} target Target object.
     * @param {Object} source Source object.
     */
    Gitana.stampInto = function(target, source) {
        for (var i in source)
        {
            if (source.hasOwnProperty(i))
            {
                target[i] = source[i];
            }
        }
    };

    Gitana.contains = function(a, obj)
    {
        var i = a.length;
        while (i--)
        {
            if (a[i] === obj)
            {
                return true;
            }
        }
        return false;
    };

    Gitana.isArray = function(obj)
    {
        return obj.push && obj.slice;
    };

    Gitana.isUndefined = function(obj)
    {
        return (typeof obj == "undefined");
    };

    Gitana.isEmpty = function(obj)
    {
        return this.isUndefined(obj) || obj == null;
    };

    Gitana.generateId = function()
    {
        Gitana.uniqueIdCounter++;
        return "gitana-" + Gitana.uniqueIdCounter;
    };

    Gitana.isNode = function(o)
    {
        return (
                typeof Node === "object" ? o instanceof Node :
                        typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string");
    };

    Gitana.isElement = function(o)
    {
        return (
                typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                        typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string");
    };

    Gitana.debug = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.log(str);
        }
    };

    Gitana.error = function(str)
    {
        if (!this.isUndefined(console))
        {
            console.error(str);
        }
    };

    Gitana.getNumberOfKeys = function(map)
    {
        var count = 0;
        for (var key in map) {
            count++;
        }

        return count;
    };

    /**
     * Writes a cookie.
     *
     * @param {String} name
     * @param {String} value
     * @param [String] path optional path (assumed "/" if not provided)
     * @param [Number] days optional # of days to store cookie
     *                      if null or -1, assume session cookie
     *                      if 0, assume expired cookie
     *                      if > 0, assume # of days
     * @param [String] domain optional domain (otherwise assumes wildcard base domain)
     */
    Gitana.writeCookie = function(name, value, path, days, domain)
    {
        if (typeof(document) !== "undefined")
        {
            var createCookie = function(name, value, path, days, host)
            {
                // path
                if (!path)
                {
                    path = "/";
                }
                var pathString = ";path=" + path;

                // expiration
                var expirationString = "";
                if (typeof(days) == "undefined" || days == -1)
                {
                    // session cookie
                }
                else if (days == 0)
                {
                    // expired cookie
                    expirationString = ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
                }
                else if (days > 0)
                {
                    var date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expirationString = ";expires="+date.toGMTString();
                }

                // domain
                var domainString = "";
                if (host)
                {
                    domainString = ";domain=" + host;
                }

                document.cookie = name + "=" + value + expirationString + pathString + domainString + ";";
            };

            createCookie(name, value, path, days, domain);
        }
    };

    /**
     * Deletes a cookie.
     *
     * @param name
     * @param path
     */
    Gitana.deleteCookie = function(name, path)
    {
        var existsCookie = function(name, path)
        {
            return Gitana.readCookie(name);
        };

        if (typeof(document) != "undefined")
        {
            // first attempt, let the browser sort out the assumed domain
            // this works for most modern browsers
            if (existsCookie(name))
            {
                // use expiration time of 0 to signal expired cookie
                Gitana.writeCookie(name, "", path, 0);
            }

            // second attempt, if necessary, plug in an assumed domain
            // this is needed for phantomjs
            if (existsCookie(name))
            {
                // see if we can resolve a domain
                if (window)
                {
                    var domain = window.location.host;
                    if (domain)
                    {
                        // remove :port
                        var i = domain.indexOf(":");
                        if (i > -1)
                        {
                            domain = domain.substring(0, i);
                        }
                    }

                    // use expiration time of 0 to signal expired cookie
                    Gitana.writeCookie(name, "", path, 0, domain);
                }
            }
        }
    };

    Gitana.readCookie = function(name)
    {
        function _readCookie(name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++)
            {
                var c = ca[i];
                while (c.charAt(0)==' ')
                {
                    c = c.substring(1,c.length);
                }

                if (c.indexOf(nameEQ) == 0)
                {
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        }

        var value = null;

        if (typeof(document) !== "undefined")
        {
            value = _readCookie(name);
        }

        return value;
    };


    Gitana.getCurrentQueryStringParameter = function(paramName)
    {
        var searchString = window.location.search.substring(1), i, val, params = searchString.split("&");

        for (i = 0; i < params.length; i++)
        {
            val = params[i].split("=");

            if (val[0] == paramName)
            {
                return unescape(val[1]);
            }
        }

        return null;
    };

    Gitana.getCurrentHashStringParameter = function(paramName)
    {
        var searchString = window.location.href.substring(window.location.href.indexOf("#") + 1);
        var params = searchString.split("&");

        for (i = 0; i < params.length; i++)
        {
            val = params[i].split("=");

            if (val[0] == paramName)
            {
                return unescape(val[1]);
            }
        }

        return null;
    };

    Gitana.btoa = function(string)
    {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        var i = 0, length = string.length, ascii, index, output = '';

        for (; i < length; i+=3) {
            ascii = [
                string.charCodeAt(i),
                string.charCodeAt(i+1),
                string.charCodeAt(i+2)
            ];

            index = [
                ascii[0] >> 2,
                ((ascii[0] & 3) << 4) | ascii[1] >> 4,
                ((ascii[1] & 15) << 2) | ascii[2] >> 6,
                ascii[2] & 63
            ];

            if (isNaN(ascii[1])) {
                index[2] = 64;
            }
            if (isNaN(ascii[2])) {
                index[3] = 64;
            }

            output += b64.charAt(index[0]) + b64.charAt(index[1]) + b64.charAt(index[2]) + b64.charAt(index[3]);
        }

        return output;
    };

    /**
     * Copies only those members that are already represented on the target.
     *
     * @inner
     *
     * @param {Object} target Target object.
     * @param {Object} source Source object.
     */
    Gitana.copyKeepers = function(target, source) {

        if (!source) { return; }

        for (var i in source) {
            if (source.hasOwnProperty(i) && !this.isFunction(source[i])) {
                if (!Gitana.isUndefined(target[i])) {
                    target[i] = source[i];
                }
            }
        }
    };

})(window);