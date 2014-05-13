(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ConversionTrigger = Gitana.AbstractWarehouseObject.extend(
    /** @lends Gitana.ConversionTrigger.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class ConversionTrigger
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.ConversionTrigger"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CONVERSION_TRIGGER;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/triggers/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().conversionTrigger(this.getWarehouse(), this);
        }

    });

})(window);
