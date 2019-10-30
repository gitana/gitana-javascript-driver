(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.BillingProviderConfigurationMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.BillingProviderConfigurationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of billing provider configurations
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.BillingProviderConfigurationMap"; };


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
            return this.getFactory().billingProviderConfigurationMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().billingProviderConfiguration(this.getPlatform(), json);
        }

    });

})(window);
