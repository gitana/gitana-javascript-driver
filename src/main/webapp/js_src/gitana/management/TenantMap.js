(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TenantMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.TenantMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of tenant objects
         *
         * @param {Gitana.Management} management Gitana management object
         * @param {Object} object
         */
        constructor: function(management, object)
        {
            this.objectType = "Gitana.TenantMap";

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
            return this.getFactory().tenantMap(this.getManagement(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().tenant(this.getManagement(), json);
        }

    });

})(window);
