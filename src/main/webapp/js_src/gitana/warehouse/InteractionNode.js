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
        listAttachments: function(local)
        {
            var self = this;

            var attachmentMap = new Gitana.BinaryAttachmentMap(this);

            var result = this.subchain(attachmentMap);

            if (!local)
            {
                // front-load some work that fetches from remote server
                result.subchain().then(function() {

                    var chain = this;

                    self.getDriver().gitanaGet(self.getUri() + "/attachments", null, function(response) {

                        var map = {};
                        for (var i = 0; i < response.rows.length; i++)
                        {
                            map[response.rows[i]["_doc"]] = response.rows[i];
                        }
                        attachmentMap.handleMap(map);

                        chain.next();
                    });

                    return false;
                });
            }
            else
            {
                // try to populate the map from our cached values on the node (if they exist)
                var existingMap = this.getSystemMetadata()._system.attachments;

                var map = {};
                Gitana.copyInto(map, existingMap);

                attachmentMap.handleMap(map);
            }

            return result;
        },

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
        attach: function(attachmentId, contentType, data)
        {
            var self = this;

            // the thing we're handing back
            var result = this.subchain(new Gitana.BinaryAttachment(this, attachmentId));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, null, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listAttachments().select(attachmentId).then(function() {
                        result.handleAttachment(this.attachment);
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
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
