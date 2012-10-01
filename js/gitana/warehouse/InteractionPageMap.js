(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionPageMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionPageMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionPageMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = "Gitana.InteractionPageMap";


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
            return this.getFactory().interactionPageMap(this.getWarehouse(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionPage(this.getWarehouse(), json);
        }

    });

})(window);
