(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionPostalCode = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionPostalCode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionPostalCode
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.InteractionPostalCode"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_POSTALCODE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/postalcodes/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionPostalCode(this.getWarehouse(), this);
        }

    });

})(window);
