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

            this.objectType = function() { return "Gitana.InteractionNode"; };
            this.interactionObjectTypeId = "node";
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_NODE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/nodes/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionNode(this.getWarehouse(), this);
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
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @param local
         *
         * @public
         */
        listAttachments: Gitana.Methods.listAttachments(),

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: Gitana.Methods.attach(),

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach(),



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
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CAPTURE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Captures information about the targeted node including snapshot info.
         * If existing capture information is in place, it is overwritten.
         *
         * Note that this call is asynchronous - a job is started on the server to perform the capture.
         * The results will not be available until the job completes.
         *
         * @chained this
         *
         * @public
         */
        capture: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/capture";
            };

            return this.chainPostEmpty(this, uriFunction);
        }


    });

})(window);
