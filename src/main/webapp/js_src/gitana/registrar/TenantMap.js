(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TenantMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.TenantMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of tenant objects
         *
         * @param {Gitana.Registrar} registrar Gitana registrar object
         * @param {Object} object
         */
        constructor: function(registrar, object)
        {
            this.objectType = "Gitana.TenantMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getRegistrar = function()
            {
                return registrar;
            };

            this.getRegistrarId = function()
            {
                return registrar.getId();
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(registrar.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().tenantMap(this.getRegistrar(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().tenant(this.getRegistrar(), json);
        }

    });

})(window);
