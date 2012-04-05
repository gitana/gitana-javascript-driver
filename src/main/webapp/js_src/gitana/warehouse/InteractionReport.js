(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionReport = Gitana.AbstractWarehouseObject.extend(
    /** @lends Gitana.InteractionReport.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObject
         *
         * @class InteractionReport
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = "Gitana.InteractionReport";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/reports/" + this.getId();
        },

        getKey: function()
        {
            return this.get("key");
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // REPORT ENTRIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction report entries.
         *
         * @param pagination
         *
         * @chained interaction report entry map
         */
        listEntries: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionReportEntryMap(this);
            return this.chainGet(chainable, this.getUri() + "/entries", params);
        },

        /**
         * Reads an interaction report entry.
         *
         * @param interactionReportEntryId
         *
         * @chained interaction report entry
         */
        readEntry: function(interactionReportEntryId)
        {
            var chainable = this.getFactory().interactionReportEntry(this);
            return this.chainGet(chainable, this.getUri() + "/entries/" + interactionReportEntryId);
        },

        /**
         * Queries for interaction report entries.
         *
         * @chained interaction map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryEntries: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/entries/query";
            };

            var chainable = this.getFactory().interactionReportEntryMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        }

    });

})(window);
