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

            this.objectType = "Gitana.Interaction";
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
            return this.object["source"]["user-agent"];
        },

        getSourceHost: function()
        {
            return this.object["source"]["host"];
        },

        getSourceIP: function()
        {
            return this.object["source"]["ip"];
        },

        getEventType: function()
        {
            return this.object["event"]["type"];
        },

        getEventX: function()
        {
            return this.object["event"]["x"];
        },

        getEventY: function()
        {
            return this.object["event"]["y"];
        },

        getEventOffsetX: function()
        {
            return this.object["event"]["offsetX"];
        },

        getEventOffsetY: function()
        {
            return this.object["event"]["offsetY"];
        },

        getApplicationHost: function()
        {
            return this.object["application"]["host"];
        },

        getApplicationUrl: function()
        {
            return this.object["application"]["url"];
        },

        getApplicationUri: function()
        {
            return this.object["application"]["uri"];
        },

        getElementId: function()
        {
            return this.object["element"]["id"];
        },

        getElementType: function()
        {
            return this.object["element"]["type"];
        },

        getElementPath: function()
        {
            return this.object["element"]["path"];
        },

        getNodeRepositoryId: function()
        {
            return this.object["node"]["repositoryId"];
        },

        getNodeBranchId: function()
        {
            return this.object["node"]["branchId"];
        },

        getNodeId: function()
        {
            return this.object["node"]["nodeId"];
        },

        getTimestampStart: function()
        {
            return this.object["timestamp"]["start"];
        },

        getTimestampEnd: function()
        {
            return this.object["timestamp"]["end"];
        },

        getTimestampMs: function()
        {
            return this.object["timestamp"]["ms"];
        },

        getPrincipalDomainId: function()
        {
            return this.object["principal"]["domainId"];
        },

        getPrincipalId: function()
        {
            return this.object["principal"]["id"];
        }
    });

})(window);
