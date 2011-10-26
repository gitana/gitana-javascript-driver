(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.LogEntryMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.LogEntryMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of log entries
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.LogEntryMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().logEntryMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().logEntry(this.getServer(), json);
        }

    });

})(window);
