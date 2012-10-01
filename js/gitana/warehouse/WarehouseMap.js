(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WarehouseMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.WarehouseMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of warehouse objects
         *
         * @param {Gitana.Platform} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.WarehouseMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().warehouseMap(this.getPlatform(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().warehouse(this.getPlatform(), json);
        }

    });

})(window);
