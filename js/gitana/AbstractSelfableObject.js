(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractSelfableObject = Gitana.AbstractObject.extend(
    /** @lends Gitana.AbstractSelfableObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Abstract base class for selfable Gitana document objects.
         *
         * @param {Gitana} driver
         * @param {Object} [object]
         */
        constructor: function(driver, object)
        {
            // finally chain to parent prototype
            this.base(driver, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // SELFABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Delete
         *
         * @chained this
         *
         * @public
         */
        del: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri();
            };

            // NOTE: pass control back to the server instance
            return this.chainDelete(this.getPlatform(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained this
         *
         * @public
         */
        reload: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri();
            };

            return this.chainReload(null, uriFunction);
        },

        /**
         * Update
         *
         * @chained this
         *
         * @public
         */
        update: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri();
            };

            return this.chainUpdate(null, uriFunction);
        }

    });

})(window);
