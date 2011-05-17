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
         * @param persistable
         * @param [Object] object
         */
        constructor: function(persistable, object)
        {
            this.objectType = "Gitana.AuditRecordMap";

            this.persistable = persistable;

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(persistable.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecordMap(this.persistable, this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().auditRecord(this.persistable, json);
        }

    });

})(window);
