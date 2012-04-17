(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionPage = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionPage.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionPage
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = "Gitana.InteractionPage";
            this.interactionObjectTypeId = "page";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/pages/" + this.getId();
        },

        getInteractionApplicationId: function()
        {
            return this.get("interactionApplicationId");
        },

        getPageUri: function()
        {
            return this.get("uri");
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
            query["interactionPageId"] = this.getId();

            return this.subchain(this.getWarehouse()).queryInteractions(query, pagination);
        }


    });

})(window);
