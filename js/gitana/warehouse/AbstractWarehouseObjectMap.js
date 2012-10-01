(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractWarehouseObjectMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.AbstractWarehouseObjectMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class AbstractWarehouseObjectMap
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getWarehouse = function()
            {
                return warehouse;
            };

            this.getWarehouseId = function()
            {
                return warehouse.getId();
            };

            // NOTE: call this last
            this.base(warehouse.getPlatform(), object);
        }

    });

})(window);
