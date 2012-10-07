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
            this.objectType = function() { return "Gitana.AuditRecordMap"; };

            this.datastore = datastore;

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(datastore.getDriver(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecordMap(this.datastore, this);
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
