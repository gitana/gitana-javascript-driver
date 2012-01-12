(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ContainedDataStore = Gitana.DataStore.extend(
    /** @lends Gitana.ContainedDataStore.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class ContainedDataStore
         *
         * @param {Gitana.DataStore} container
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(container, object)
        {
            this.base(container.getDriver(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getContainer = function()
            {
                return container;
            };

            this.getContainerId = function()
            {
                return container.getId();
            };

        },

        /**
         * Delete
         *
         * @chained container datastore
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the container datastore instance
            return this.chainDelete(this.getContainer(), uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(this.clone(), uriFunction);
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
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        }

    });

})(window);
