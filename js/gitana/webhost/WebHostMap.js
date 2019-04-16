(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.WebHostMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.WebHostMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of web host objects
         *
         * @param {Gitana.Platform} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.WebHostMap"; };


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
            return this.getFactory().webhostMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().webhost(this.getPlatform(), json);
        }

    });

})(window);
