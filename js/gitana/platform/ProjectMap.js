(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.ProjectMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ProjectMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of projects
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.ProjectMap"; };


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
            return this.getFactory().projectMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().project(this.getPlatform(), json);
        }

    });

})(window);
