(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractWarehouseObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractWarehouseObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Abstract base class for Warehouse objects
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse.getPlatform(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Warehouse object.
             *
             * @inner
             *
             * @returns {Gitana.Warehouse} The Gitana Warehouse object
             */
            this.getWarehouse = function() { return warehouse; };

            /**
             * Gets the Gitana Warehouse id.
             *
             * @inner
             *
             * @returns {String} The Gitana Warehouse id
             */
            this.getWarehouseId = function() { return warehouse.getId(); };
        }

    });

})(window);
