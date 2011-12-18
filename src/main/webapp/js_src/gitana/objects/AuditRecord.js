(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuditRecord = Gitana.AbstractObject.extend(
    /** @lends Gitana.AuditRecord.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class AuditRecord
         *
         * @param {Object} datastore
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(datastore, object)
        {
            this.base(datastore.getPlatform(), object);

            this.objectType = "Gitana.AuditRecord";



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Data Store object.
             *
             * @inner
             *
             * @returns {Gitana.DataStore} The Gitana DataStore object
             */
            this.getDataStore = function() { return datastore; };

            /**
             * Gets the Gitana Data Store id.
             *
             * @inner
             *
             * @returns {String} The Gitana DataStore id
             */
            this.getDataStoreId = function() { return datastore.getId(); };

        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return this.datastore.getUri() + "/audit";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().auditRecord(this.getDataStore(), this.object);
        },

        /**
         * @returns {String} the scope of the audit record (i.e. "NODE")
         */
        getScope: function()
        {
            return this.get("scope");
        },

        /**
         * @returns {String} the action of the audit record ("CREATE", "READ", "UPDATE", "DELETE", "MOVE", "COPY", "EXISTS")
         */
        getAction: function()
        {
            return this.get("action");
        },

        /**
         * @returns {String} the principal for the audit record
         */
        getPrincipalId: function()
        {
            return this.get("principal");
        },

        /**
         * @returns {String} method that was invoked
         */
        getMethod: function()
        {
            return this.get("method");
        },

        /**
         * @returns {String} handler
         */
        getHandler: function()
        {
            return this.get("handler");
        },

        /**
         * @returns {Object} argument descriptors
         */
        getArgs: function()
        {
            return this.get("args");
        },

        /**
         * @returns {Object} return value descriptor
         */
        getReturn: function()
        {
            return this.get("return");
        }

    });

})(window);
