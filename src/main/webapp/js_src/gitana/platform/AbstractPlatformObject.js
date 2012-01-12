(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractPlatformObject = Gitana.AbstractSelfableACLObject.extend(
    /** @lends Gitana.AbstractPlatformObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractSelfableACLObject
         *
         * @class AbstractPlatformObject
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform.getDriver(), object);


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
