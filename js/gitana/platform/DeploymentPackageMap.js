(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DeploymentPackageMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.DeploymentPackageMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of deployment packages
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param [Object] object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.DeploymentPackageMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deploymentPackageMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().deploymentPackage(this.getPlatform(), json);
        }

    });

})(window);
