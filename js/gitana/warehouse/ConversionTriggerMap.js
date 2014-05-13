(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ConversionTriggerMap = Gitana.AbstractWarehouseObjectMap.extend(
    /** @lends Gitana.ConversionTriggerMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObjectMap
         *
         * @class ConversionTriggerMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.objectType = function() { return "Gitana.ConversionTriggerMap"; };


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
            return this.getFactory().conversionTriggerMap(this.getWarehouse(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().conversionTrigger(this.getWarehouse(), json);
        }

    });

})(window);
