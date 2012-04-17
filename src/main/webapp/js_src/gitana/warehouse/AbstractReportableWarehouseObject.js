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
            return this.subchain(this.getWarehouse()).listInteractionReports(this.interactionObjectTypeId, this.getId(), pagination);
        },

        /**
         * Reads an interaction report.
         *
         * @param interactionReportKeyOrId
         *
         * @chained interaction report
         */
        readReport: function(interactionReportKeyOrId)
        {
            return this.subchain(this.getWarehouse()).readInteractionReport(this.interactionObjectTypeId, this.getId(), interactionReportKeyOrId);
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
            return this.subchain(this.getWarehouse()).queryInteractionReports(this.interactionObjectTypeId, this.getId(), query, pagination);
        }
    });

})(window);
