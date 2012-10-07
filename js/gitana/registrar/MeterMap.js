(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.MeterMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.MeterMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of meter objects
         *
         * @param {Gitana.Registrar} registrar Gitana registrar object
         * @param {Object} object
         */
        constructor: function(registrar, object)
        {
            this.objectType = function() { return "Gitana.MeterMap"; };


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
            return this.getFactory().planMap(this.getRegistrar(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().plan(this.getRegistrar(), json);
        }

    });

})(window);
