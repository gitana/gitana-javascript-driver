(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionNode = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionNode
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = "Gitana.InteractionNode";
            this.interactionObjectTypeId = "node";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/nodes/" + this.getId();
        },

        getRepositoryId: function()
        {
            return this.get("repositoryId");
        },

        getBranchId: function()
        {
            return this.get("branchId");
        },

        getNodeId: function()
        {
            return this.get("nodeId");
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interactions.
         *
         * @param pagination
         *
         * @chained interaction map
         */
        listInteractions: function(pagination)
        {
            return this.queryInteractions(null, pagination);
        },

        /**
         * Queries for interactions.
         *
         * @chained interaction map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractions: function(query, pagination)
        {
            if (!query)
            {
                query = {};
            }
            query["interactionNodeId"] = this.getId();

            return this.subchain(this.getWarehouse()).queryInteractions(query, pagination);
        }

    });

})(window);
