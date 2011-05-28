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

})(window);