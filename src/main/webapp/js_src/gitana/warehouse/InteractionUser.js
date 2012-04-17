(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionUser = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionUser.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionUser
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = "Gitana.InteractionUser";
            this.interactionObjectTypeId = "user";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/users/" + this.getId();
        },

        getKey: function()
        {
            return this.get("key");
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
            query["interactionUserId"] = this.getId();

            return this.subchain(this.getWarehouse()).queryInteractions(query, pagination);
        }


    });

})(window);
