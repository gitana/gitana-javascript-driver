(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.ClientMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ClientMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of clients
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.ClientMap"; };


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
            return this.getFactory().clientMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().client(this.getPlatform(), json);
        }

    });

})(window);
