(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.BillingProviderConfiguration = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.BillingProviderConfiguration.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class BillingProviderConfiguration
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.BillingProviderConfiguration";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/billing/configurations/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().billingProviderConfiguration(this.getPlatform(), this.object);
        }

    });

})(window);
