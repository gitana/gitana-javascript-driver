(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionReportEntryMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionReportEntryMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionReportEntryMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = "Gitana.InteractionReportEntryMap";


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
            return this.getFactory().interactionReportEntryMap(this.getWarehouse(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionReportEntry(this.getWarehouse(), json);
        }

    });

})(window);
