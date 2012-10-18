(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.DomainPrincipal = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.DomainPrincipal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class DomainPrincipal
         *
         * @param {Gitana.Domain} domain
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(domain, object)
        {
            this.base(domain.getPlatform(), object);

            this.objectType = function() { return "Gitana.DomainPrincipal"; };



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
            return this.getFactory().domainPrincipal(this.getDomain(), this);
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
         * @param {Pagination} pagination
         */
        listMemberships: function(indirect, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var uri = this.getUri() + "/memberships";
                if (indirect)
                {
                    uri = uri + "?indirect=true";
                }

                return uri;
            };

            var chainable = this.getFactory().domainPrincipalMap(this.getDomain());
            return this.chainGet(chainable, uriFunction, params);
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
        unattach: Gitana.Methods.unattach()

    });

})(window);
