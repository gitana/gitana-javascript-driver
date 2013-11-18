(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionCountry = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionCountry.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionCountry
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.InteractionCountry"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_COUNTRY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/countries/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionCountry(this.getWarehouse(), this);
        }

    });

})(window);
