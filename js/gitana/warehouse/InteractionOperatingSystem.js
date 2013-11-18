(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionOperatingSystem = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionOperatingSystem.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionOperatingSystem
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.InteractionOperatingSystem"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_OPERATINGSYSTEM;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/operatingsystems/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionOperatingSystem(this.getWarehouse(), this);
        }

    });

})(window);
