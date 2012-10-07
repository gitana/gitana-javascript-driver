(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionSessionMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.InteractionSessionMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class InteractionSessionMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.InteractionSessionMap"; };


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
            return this.getFactory().interactionSessionMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interactionSession(this.getWarehouse(), json);
        }

    });

})(window);
