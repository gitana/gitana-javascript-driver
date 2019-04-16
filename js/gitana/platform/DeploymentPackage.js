(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DeploymentPackage = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DeploymentPackage.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DeploymentPackage
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.DeploymentPackage"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DEPLOYMENT_PACKAGE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/deployment/packages/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deploymentPackage(this.getPlatform(), this);
        }

    });

})(window);
