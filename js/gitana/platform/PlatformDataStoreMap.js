(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.PlatformDataStoreMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.PlatformDataStoreMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of platform datastore objects
         *
         * @param {Gitana} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.PlatformDataStoreMap"; };

            this.getPlatform = function()
            {
                return platform;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().platformDataStoreMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().platformDataStore(this.getPlatform(), json);
        }

    });

})(window);
