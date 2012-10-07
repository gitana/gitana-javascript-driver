(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionApplicationMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionApplicationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionApplicationMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.InteractionApplicationMap"; };


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
            return this.getFactory().interactionApplicationMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionApplication(this.getWarehouse(), json);
        }

    });

})(window);
