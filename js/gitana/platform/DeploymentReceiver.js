(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DeploymentReceiver = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DeploymentReceiver.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DeploymentReceiver
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.DeploymentReceiver"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DEPLOYMENT_RECEIVER;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/deployment/receivers/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().deploymentReceiver(this.getPlatform(), this);
        }

    });

})(window);
