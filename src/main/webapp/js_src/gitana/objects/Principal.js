(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Principal = Gitana.AbstractObject.extend(
    /** @lends Gitana.Principal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Principal
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Principal";
        },

        /**
         * @returns {String} the principal id
         */
        getPrincipalId: function()
        {
            return this.get("principal-id");
        },

        /**
         * @returns {String} the principal type ("user" or "group")
         */
        getPrincipalType: function()
        {
            return this.get("principal-type");
        },

        /**
         * Acquires the groups that contain this principal
         *
         * @chained principal map
         *
         * @public
         *
         * @param {Boolean} indirect whether to consider indirect groups
         */
        listMemberships: function(indirect)
        {
            var _this = this;

            // uri
            var uri = "/security/" + this.getPrincipalType().toLowerCase() + "s/" + _this.getPrincipalId() + "/memberships";
            if (indirect)
            {
                uri = uri + "?indirect=true";
            }

            var chainable = this.getFactory().principalMap(this.getServer());
            return this.chainGet(chainable, uri);
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
         * @public
         */
        listAttachments: function()
        {
            var self = this;

            var attachmentMap = new Gitana.BinaryAttachmentMap(this);

            var result = this.subchain(attachmentMap);
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
        }

    });

})(window);
