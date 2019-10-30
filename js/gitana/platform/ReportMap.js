(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.ReportMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ReportMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of reports
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.ReportMap"; };


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
            return this.getFactory().reportMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().report(this.getPlatform(), json);
        }

    });

})(window);
