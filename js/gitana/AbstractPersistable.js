(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractPersistable = Gitana.Chainable.extend(
    /** @lends Gitana.AbstractPersistable.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Abstract base class for abstract objects and maps
         *
         * @param {Gitana} driver Gitana driver
         * @param [Object] object
         */
        constructor: function(driver, object)
        {
            this.base(driver);

            // auto-load response
            if (!this.object)
            {
                this.object = {};
            }
            if (object)
            {
                this.handleResponse.call(this, object);
            }
        },

        /**
         * @EXTENSION_POINT
         *
         * Convert the json response object into the things we want to preserve on the object.
         * This should set the "object" property but may choose to set other properties as well.
         *
         * @param response
         */
        handleResponse: function(response)
        {
            // remove existing object properties
            for (var i in this.object) {
                if (this.object.hasOwnProperty(i) && !Gitana.isFunction(this.object[i])) {
                    delete this.object[i];
                }
            }

            // special handling - if response contains "_ref", remove it
            delete response["_ref"];

            Gitana.copyInto(this.object, response);

            this.handleSystemProperties();
        },

        /**
         * Gets called after the response is handled and allows the object to pull out special values from
         * the "object" field so that they don't sit on the JSON object
         */
        handleSystemProperties: function()
        {

        }

    });

})(window);
