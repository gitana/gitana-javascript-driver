(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractPlatformObjectMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.AbstractPlatformObjectMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class AbstractPlatformObjectMap
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
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

            // NOTE: call this last
            this.base(platform.getDriver(), object);
        }

    });

})(window);
