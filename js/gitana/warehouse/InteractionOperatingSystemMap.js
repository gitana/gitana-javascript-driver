(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionOperatingSystemMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionOperatingSystemMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionOperatingSystemMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.InteractionOperatingSystemMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(warehouse, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionOperatingSystemMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionOperatingSystem(this.getWarehouse(), json);
        }

    });

})(window);
