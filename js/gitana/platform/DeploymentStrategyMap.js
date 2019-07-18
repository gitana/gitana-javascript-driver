(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.DeploymentStrategyMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.DeploymentStrategyMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of deployment strategies
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.DeploymentStrategyMap"; };


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
            return this.getFactory().deploymentStrategyMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().deploymentStrategy(this.getPlatform(), json);
        }

    });

})(window);
