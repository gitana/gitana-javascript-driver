(function(window)
{
    if (typeof Gitana === "undefined")
    {
        /** @namespace */
        Gitana = { };
    }

    Gitana.Abstract = Base.extend(
    /** @lends Gitana.Abstract.prototype */
    {

        /**
         * @constructs
         * 
         * @class Abstract base class for driver services and objects.
         */
        constructor: function()
        {
            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * PRIVILEGED METHOD
             * Builds an array from javascript method arguments.
             *
             * @inner
             *
             * @param {arguments} arguments
             *
             * @returns {Array} an array
             */
            this.makeArray = function(arguments) {
                return Array.prototype.slice.call(arguments);
            };

            /**
             * PRIVILEGED METHOD
             * Serializes a object into a JSON string and optionally makes it pretty by indenting.
             *
             * @inner
             *
             * @param {Object} object The javascript object.
             * @param {Boolean} pretty Whether the resulting string should have indentation.
             *
             * @returns {String} string
             */
            this.buildString = function(object, pretty) {

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
             * PRIVILEGED METHOD
             * Determines whether the given argument is a String.
             *
             * @inner
             *
             * @param arg argument
             *
             * @returns {Boolean} whether it is a String
             */
            this.isString = function( arg ) {
                return (typeof arg == "string");
            };

            /**
             * PRIVILEGED METHOD
             * Determines whether the given argument is a Function.
             *
             * @inner
             *
             * @param arg argument
             *
             * @returns {Boolean} whether it is a Function
             */
            this.isFunction = function(arg) {
                return Object.prototype.toString.call(arg) === "[object Function]";
            };

            /**
             * PRIVILEGED METHOD
             * Determines whether a bit of text starts with a given prefix.
             *
             * @inner
             *
             * @param {String} text A bit of text.
             * @param {String} prefix The prefix.
             *
             * @returns {Boolean} whether the text starts with the prefix.
             */
            this.startsWith = function(text, prefix) {
                return text.substr(0, prefix.length) === prefix;
            };

            /**
             * PRIVILEGED METHOD
             * Copies the members of the source object into the target object.
             * This includes both properties and functions from the source object.
             *
             * @inner
             *
             * @param {Object} target Target object.
             * @param {Object} source Source object.
             */
            this.copyInto = function(target, source) {
                for (var i in source) {
                    if (source.hasOwnProperty(i) && !this.isFunction(this[i])) {
                        target[i] = source[i];
                    }
                }
            };
        },

        /**
         * Method that produces a wrapper around a failure callback.
         *
         * If no failure callback is provided, nothing occurs.
         *
         * @public
         *
         * @param [Function] failureCallback Function to call if the operation fails.  Can be null for no-operation.
         */
        wrapFailureCallback: function(failureCallback)
        {
            var _this = this;

            var f = function(http)
            {
                // if we're in debug mode, log a bunch of good stuff out to console
                if (_this.debug)
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

                // fire callback if available
                if (failureCallback)
                {
                    failureCallback(http);
                }
            };

            return f;
        }

    });

    window.Gitana = Gitana;
    
})(window);