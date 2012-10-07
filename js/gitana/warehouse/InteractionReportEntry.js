(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionReportEntry = Gitana.AbstractWarehouseObject.extend(
    /** @lends Gitana.InteractionReportEntry.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWarehouseObject
         *
         * @class InteractionReportEntry
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.InteractionReportEntry"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_REPORT_ENTRY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/reports/" + this.getReportId() + "/entries/" + this.getId();
        },

        getReportId: function()
        {
            return this.get("reportId");
        },

        getKey: function()
        {
            return this.get("key");
        },

        getApplicationId: function()
        {
            return this.get("applicationId");
        },

        getApplicationTitle: function()
        {
            return this.get("applicationTitle");
        },

        getApplicationDescription: function()
        {
            return this.get("applicationDescription");
        },

        getSessionId: function()
        {
            return this.get("sessionId");
        },

        getSessionTitle: function()
        {
            return this.get("sessionTitle");
        },

        getSessionDescription: function()
        {
            return this.get("sessionDescription");
        },

        getPageId: function()
        {
            return this.get("pageId");
        },

        getPageUri: function()
        {
            return this.get("pageUri");
        },

        getPageTitle: function()
        {
            return this.get("pageTitle");
        },

        getPageDescription: function()
        {
            return this.get("pageDescription");
        },

        getNodeId: function()
        {
            return this.get("nodeId");
        },

        getNodeTargetRepositoryId: function()
        {
            return this.get("nodeTargetRepositoryId");
        },

        getNodeTargetBranchId: function()
        {
            return this.get("nodeTargetBranchId");
        },

        getNodeTargetId: function()
        {
            return this.get("nodeTargetId");
        },

        getNodeTitle: function()
        {
            return this.get("nodeTitle");
        },

        getNodeDescription: function()
        {
            return this.get("nodeDescription");
        },

        getUserId: function()
        {
            return this.get("userId");
        },

        getUserTitle: function()
        {
            return this.get("userTitle");
        },

        getUserDescription: function()
        {
            return this.get("userDescription");
        },

        getUserFirstName: function()
        {
            return this.get("userFirstName");
        },

        getUserLastName: function()
        {
            return this.get("userLastName");
        },

        getUserEmail: function()
        {
            return this.get("userEmail");
        },

        getUserName: function()
        {
            return this.get("userName");
        }

    });

})(window);
