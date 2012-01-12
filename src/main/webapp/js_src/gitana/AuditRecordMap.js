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
         * @param {Object} datastore
         * @param [Object] object
         */
        constructor: function(datastore, object)
        {
            this.objectType = "Gitana.AuditRecordMap";

            this.datastore = datastore;

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(datastore.getCluster(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecordMap(this.datastore, this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().auditRecord(this.datastore, json);
        }

    });

})(window);
