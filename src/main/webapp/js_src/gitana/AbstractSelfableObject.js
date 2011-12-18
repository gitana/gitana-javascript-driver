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
         * @param {Gitana.Platform} platform
         * @param [Object] object
         */
        constructor: function(platform, object)
        {
            // finally chain to parent prototype
            this.base(platform, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // SELFABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Delete
         *
         * @chained platform
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
         * @chained platform
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

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update
         *
         * @chained platform
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

            return this.chainUpdate(this.clone(), uriFunction);
        }

    });

})(window);
