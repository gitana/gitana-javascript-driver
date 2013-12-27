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

            this.objectType = function() { return "Gitana.InteractionPage"; };
            this.interactionObjectTypeId = "page";
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_INTERACTION_PAGE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/warehouses/" + this.getWarehouseId() + "/pages/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionPage(this.getWarehouse(), this);
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

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri(),


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
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CAPTURE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Captures information about the targeted page including snapshot and DOM info.
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

            return this.chainPostEmpty(null, uriFunction);
        }

    });

})(window);
