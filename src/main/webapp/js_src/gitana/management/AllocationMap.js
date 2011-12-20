(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AllocationMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.AllocationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of allocation objects
         *
         * @param {Gitana.Management} management Gitana management object
         * @param {Object} object
         */
        constructor: function(management, object)
        {
            this.objectType = "Gitana.AllocationMap";

            this.getManagement = function()
            {
                return management;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(management.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().allocationMap(this.getManagement(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().allocation(this.getManagement(), json);
        }

    });

})(window);
