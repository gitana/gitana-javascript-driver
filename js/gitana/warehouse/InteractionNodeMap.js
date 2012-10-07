(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionNodeMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionNodeMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionNodeMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.InteractionNodeMap"; };


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
            return this.getFactory().interactionNodeMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionNode(this.getWarehouse(), json);
        }

    });

})(window);
