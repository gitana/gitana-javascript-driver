(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionUserMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionUserMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionUserMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.InteractionUserMap"; };


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
            return this.getFactory().interactionUserMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionUser(this.getWarehouse(), json);
        }

    });

})(window);
