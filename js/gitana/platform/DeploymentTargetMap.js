(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DeploymentTargetMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.DeploymentTargetMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of deployment targets
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.DeploymentTargetMap"; };


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
            return this.getFactory().deploymentTargetMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().deploymentTarget(this.getPlatform(), json);
        }

    });

})(window);
