(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Archive = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Archive.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Archive
         *
         * @param {Gitana.Vault} vault
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(vault, object)
        {
            this.base(vault.getPlatform(), object);

            this.objectType = "Gitana.Archive";



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Vault object.
             *
             * @inner
             *
             * @returns {Gitana.Vault} The Gitana Vault object
             */
            this.getVault = function() { return vault; };

            /**
             * Gets the Gitana Vault id.
             *
             * @inner
             *
             * @returns {String} The Gitana Vault id
             */
            this.getVaultId = function() { return vault.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getVaultId() + "/archives/" + this.getId();
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
