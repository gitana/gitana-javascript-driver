(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.RegistrarMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.RegistrarMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of registrar objects
         *
         * @param {Gitana.Platform} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.RegistrarMap";


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
            return this.getFactory().registrarMap(this.getPlatform(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().registrar(this.getPlatform(), json);
        }

    });

})(window);
