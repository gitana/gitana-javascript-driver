(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractPlatformDataStore = Gitana.ContainedDataStore.extend(
    /** @lends Gitana.AbstractPlatformDataStore.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class AbstractPlatformDataStore
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getPlatform = function()
            {
                return platform;
            };

            this.getPlatformId = function()
            {
                return platform.getId();
            };

            this.getCluster = function()
            {
                return platform.getCluster();
            };

            this.getClusterId = function()
            {
                return platform.getClusterId();
            };

        }

    });

})(window);
