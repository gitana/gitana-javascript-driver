(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DirectoryMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.DirectoryMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of directory objects
         *
         * @param {Gitana.Platform} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.DirectoryMap"; };


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
            return this.getFactory().directoryMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().directory(this.getPlatform(), json);
        }

    });

})(window);
