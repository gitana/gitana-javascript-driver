(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.ScheduledWorkMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ScheduledWorkMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of scheduled work items
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.ScheduledWorkMap"; };


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
            return this.getFactory().scheduledWorkMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().scheduledWork(this.getPlatform(), json);
        }

    });

})(window);
