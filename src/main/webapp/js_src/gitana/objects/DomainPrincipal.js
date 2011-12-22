(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DomainPrincipal = Gitana.AbstractSelfableACLObject.extend(
    /** @lends Gitana.DomainPrincipal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class DomainPrincipal
         *
         * @param {Gitana.Domain} domain
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(domain, object)
        {
            this.base(domain.getPlatform(), object);

            this.objectType = "Gitana.DomainPrincipal";



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Domain object.
             *
             * @inner
             *
             * @returns {Gitana.Domain} The Gitana Domain object
             */
            this.getDomain = function() { return domain; };

            /**
             * Gets the Gitana Domain id.
             *
             * @inner
             *
             * @returns {String} The Gitana Domain id
             */
            this.getDomainId = function() { return domain.getId(); };
        },

        /**
         * @override
         */
        getUri: function()
        {
            return "/domains/" + this.getDomainId() + "/principals/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().domainPrincipal(this.getDomain(), this.object);
        },

        /**
         * @override
         */
        beforeChainRun: function()
        {
            // extend the principal with any type specific methods/properties
            this.getFactory().extendPrincipal(this);
        },

        /**
         * @returns {String} the principal name
         */
        getName: function()
        {
            return this.get("name");
        },

        /**
         * @returns {String} the principal type ("user" or "group")
         */
        getType: function()
        {
            return this.get("type");
        },

        /**
         * @returns {String} the domain qualified principal name
         */
        getDomainQualifiedName: function()
        {
            return this.getDomainId() + "/" + this.getName();
        },

        /**
         * @returns {String} the domain qualified principal id
         */
        getDomainQualifiedId: function()
        {
            return this.getDomainId() + "/" + this.getId();
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // MEMBERSHIPS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

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
            var uri = this.getUri() + "/memberships";
            if (indirect)
            {
                uri = uri + "?indirect=true";
            }

            var chainable = this.getFactory().domainPrincipalMap(this.getPlatform());
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
