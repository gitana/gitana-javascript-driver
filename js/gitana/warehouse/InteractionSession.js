(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionSession = Gitana.AbstractReportableWarehouseObject.extend(
    /** @lends Gitana.InteractionSession.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractReportableWarehouseObject
         *
         * @class InteractionSession
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.InteractionSession"; };
            this.interactionObjectTypeId = "session";
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_SESSION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/sessions/" + this.getId();
        },

        getInteractionApplicationId: function()
        {
            return this.get("interactionApplicationId");
        },

        getTimestampStart: function()
        {
            return this.get("timestamp")["start"];
        },

        getTimestampEnd: function()
        {
            return this.get("timestamp")["end"];
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
            query["interactionSessionId"] = this.getId();

            return this.subchain(this.getWarehouse()).queryInteractions(query, pagination);
        }


    });

})(window);
