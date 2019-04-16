(function(window)
{
    const Gitana = window.Gitana;
    
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
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.BillingProviderConfiguration"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_BILLING_PROVIDER_CONFIGURATION;
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
            return this.getFactory().billingProviderConfiguration(this.getPlatform(), this);
        }

    });

})(window);
