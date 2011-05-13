(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuditRecordMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.AuditRecordMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of audit record objects
         *
         * @param {Gitana.Server} server
         * @param [Object] object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.AuditRecordMap";


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
            return this.getFactory().auditRecordMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().auditRecord(this.getServer(), json);
        }

    });

})(window);
