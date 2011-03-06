(function(window)
{
    /**
     * Declare the gitana namespace
     */
    if (typeof Gitana === "undefined")
    {
        Gitana = { };
    }

    /**
     * Abstract base class for Gitana driver objects
     */
    Gitana.Abstract = Base.extend({

        constructor: function()
        {
            // public properties
            this.VERSION = "0.1.0";
            

            /**
             * Declare any priviledged methods
             */
            this.makeArray = function(nonarray) {
                return Array.prototype.slice.call(nonarray);
            };
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
            this.isFunction = function(obj) {
                return Object.prototype.toString.call(obj) === "[object Function]";
            };
            this.startsWith = function(text, prefix) {
                return text.substr(0, prefix.length) === prefix;
            };
            this.copyInto = function(target, source) {
                for (var i in source) {
                    if (source.hasOwnProperty(i)) {
                        target[i] = source[i];
                    }
                }
            };
        },

        /**
         * Default ajax error handler
         *
         * @param http
         */
        ajaxErrorHandler: function(http)
        {
            alert("Error: " + http.status);
        }

    });

    window.Gitana = Gitana;
    
})(window);