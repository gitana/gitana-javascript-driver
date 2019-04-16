(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DomainPrincipal = Gitana.AbstractDomainObject.extend(
    /** @lends Gitana.DomainPrincipal.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractDomainObject
         *
         * @class DomainPrincipal
         *
         * @param {Gitana.Domain} domain
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(domain, object)
        {
            this.base(domain, object);

            this.objectType = function() { return "Gitana.DomainPrincipal"; };
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
         * @param {Object} pagination
         */
        listMemberships: function(indirect, pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                let uri = this.getUri() + "/memberships";
                if (indirect)
                {
                    uri = uri + "?indirect=true";
                }

                return uri;
            };

            const chainable = this.getFactory().domainPrincipalMap(this.getDomain());
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
        unattach: Gitana.Methods.unattach(),

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri(),

        /**
         * Lists the authentication grants for this principal
         *
         * @param pagination
         *
         * @chained authentication grant map
         */
        listAuthenticationGrants: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            params.domainId = this.getDomainId();
            params.principalId = this.getId();

            const chainable = this.getFactory().authenticationGrantMap(this.getPlatform());
            return this.chainGet(chainable, "/auth/grants", params);
        },

        /**
         * Lists the teams that this principal belongs to against the given teamable
         *
         * @param teamable
         * @param pagination (optional)
         */
        listTeamMemberships: function(teamable, pagination)
        {
            const params = {
                "teamableType": teamable.getType(),
                "teamableId": teamable.getId()
            };

            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return this.getUri() + "/teams";
            };

            const chainable = this.getFactory().teamMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
