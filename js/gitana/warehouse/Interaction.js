(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Interaction = Gitana.AbstractWarehouseObject.extend(
    /** @lends Gitana.Interaction.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Interaction
         *
         * @param {Gitana.Warehouse} warehouse
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(warehouse, object)
        {
            this.base(warehouse, object);

            this.objectType = function() { return "Gitana.Interaction"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/interactions/" + this.getId();
        },




        //////////////////////////////////////////////////////////////////////////////////////////////
        //
        // METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////

        getInteractionApplicationId: function()
        {
            return this.get("interactionApplicationId");
        },

        getInteractionSessionId: function()
        {
            return this.get("interactionSessionId");
        },

        getInteractionPageId: function()
        {
            return this.get("interactionPageId");
        },

        getInteractionUserId: function()
        {
            return this.get("interactionUserId");
        },

        getInteractionNodeId: function()
        {
            return this.get("interactionNodeId");
        },

        getSourceUserAgent: function()
        {
            return this["source"]["user-agent"];
        },

        getSourceHost: function()
        {
            return this["source"]["host"];
        },

        getSourceIP: function()
        {
            return this["source"]["ip"];
        },

        getEventType: function()
        {
            return this["event"]["type"];
        },

        getEventX: function()
        {
            return this["event"]["x"];
        },

        getEventY: function()
        {
            return this["event"]["y"];
        },

        getEventOffsetX: function()
        {
            return this["event"]["offsetX"];
        },

        getEventOffsetY: function()
        {
            return this["event"]["offsetY"];
        },

        getApplicationHost: function()
        {
            return this["application"]["host"];
        },

        getApplicationUrl: function()
        {
            return this["application"]["url"];
        },

        getApplicationUri: function()
        {
            return this["application"]["uri"];
        },

        getElementId: function()
        {
            return this["element"]["id"];
        },

        getElementType: function()
        {
            return this["element"]["type"];
        },

        getElementPath: function()
        {
            return this["element"]["path"];
        },

        getNodeRepositoryId: function()
        {
            return this["node"]["repositoryId"];
        },

        getNodeBranchId: function()
        {
            return this["node"]["branchId"];
        },

        getNodeId: function()
        {
            return this["node"]["id"];
        },

        getTimestampStart: function()
        {
            return this["timestamp"]["start"];
        },

        getTimestampEnd: function()
        {
            return this["timestamp"]["end"];
        },

        getTimestampMs: function()
        {
            return this["timestamp"]["ms"];
        },

        getPrincipalDomainId: function()
        {
            return this["principal"]["domainId"];
        },

        getPrincipalId: function()
        {
            return this["principal"]["id"];
        }
    });

})(window);
