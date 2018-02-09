(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DeploymentStrategy = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DeploymentStrategy.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DeploymentStrategy
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.DeploymentStrategy"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DEPLOYMENT_STRATEGY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/deployment/strategies/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deploymentStrategy(this.getPlatform(), this);
        }

    });

})(window);
