(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionReportMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionReportMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionReportMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = "Gitana.InteractionReportMap";


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
            return this.getFactory().interactionReportMap(this.getWarehouse(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionReport(this.getWarehouse(), json);
        }

    });

})(window);
