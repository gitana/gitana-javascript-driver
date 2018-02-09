(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DeploymentTarget = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DeploymentTarget.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DeploymentTarget
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.DeploymentTarget"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DEPLOYMENT_TARGET;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/deployment/targets/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deploymentTarget(this.getPlatform(), this);
        }

    });

})(window);
