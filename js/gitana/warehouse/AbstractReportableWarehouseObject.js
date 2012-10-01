(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractReportableWarehouseObject = Gitana.AbstractWarehouseObject.extend(
    /** @lends Gitana.AbstractReportableWarehouseObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObject
         *
         * @class Abstract base class for Reportable Warehouse objects
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            // TO BE OVERRIDDEN BY SUBCLASSES
            this.interactionObjectTypeId = null;
        },

        /**
         * Lists the interaction reports.
         *
         * @param pagination (optional)
         *
         * @chained interaction report map
         */
        listReports: function(pagination)
        {
            return this.queryReports({}, pagination);
        },

        /**
         * Reads an interaction report.
         *
         * @param interactionReportKeyOrId
         *
         * @chained interaction report
         */
        readReport: function(interactionReportKey)
        {
            return this.queryReports({"key": interactionReportKey}).keepOne();
        },

        /**
         * Queries for interaction reports.
         *
         * @parma query
         * @param pagination (optional)
         *
         * @chained interaction report map
         */
        queryReports: function(query, pagination)
        {
            if (!query)
            {
                query = {};
            }
            query["objectTypeId"] = this.interactionObjectTypeId;
            query["objectId"] = this.getId();

            return this.subchain(this.getWarehouse()).queryInteractionReports(query, pagination);
        }
    });

})(window);
