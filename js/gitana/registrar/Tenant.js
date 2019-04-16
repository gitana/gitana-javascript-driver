(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Tenant = Gitana.AbstractRegistrarObject.extend(
    /** @lends Gitana.Tenant.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRegistrarObject
         *
         * @class Tenant
         *
         * @param {Gitana.Registrar} registrar
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar, object);

            this.objectType = function() { return "Gitana.Tenant"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_TENANT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/registrars/" + this.getRegistrarId() + "/tenants/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().tenant(this.getRegistrar(), this);
        },

        /**
         * Gets the DNS slug for the tenant
         */
        getDnsSlug: function()
        {
            return this.get("dnsSlug");
        },

        /**
         * Gets the plan key for the tenant
         */
        getPlanKey: function()
        {
            return this.get("planKey");
        },

        /**
         * Gets the id of the principal that is the owner of this tenant.
         */
        getPrincipalId: function()
        {
            return this.get("principalId");
        },

        /**
         * Gets the domain id of the principal that is the owner of this tenant.
         */
        getPrincipalDomainId: function()
        {
            return this.get("domainId");
        },

        /**
         * Gets the id of the platform that belongs to this tenant.
         */
        getPlatformId: function()
        {
            return this.get("platformId");
        },

        /**
         * Hands back the plan that this tenant is subscribed to.
         *
         * @chained plan
         */
        readTenantPlan: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getPlatform().getUri() + "/registrars/" + self.getRegistrarId() + "/plans/" + self.getPlanKey();
            };

            const chainable = this.getFactory().plan(this.getRegistrar());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Hands back the principal that owns this tenant.
         *
         * @chained principal
         */
        readTenantPrincipal: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getPlatform().getUri() + "/domains/" + self.getPrincipalDomainId() + "/principals/" + self.getPrincipalId();
            };

            // TODO - this is a pretty big hack at the moment
            const domain = this.getFactory().domain(this.getPlatform(), {
                "_doc": this.getPrincipalDomainId()
            });

            const chainable = this.getFactory().domainPrincipal(domain);
            return this.chainGet(chainable, uriFunction);
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
        // METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the allocations to the tenant.
         *
         * @param callback the callback function
         * @param objectType
         * @param pagination
         *
         * @chained this
         */
        listAllocatedObjects: function(callback, objectType, pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/objects";
            };

            // parameters
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }
            if (objectType)
            {
                params["type"] = objectType;
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback.call(this, response["rows"]);
            });
        },

        listAllocatedRepositoryObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "repository", pagination);
        },

        listAllocatedDomainObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "domain", pagination);
        },

        listAllocatedVaultObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "vault", pagination);
        },

        listAllocatedClientObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "client", pagination);
        },

        listAllocatedRegistrarObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "registrar", pagination);
        },

        listAllocatedStackObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "stack", pagination);
        },

        listAllocatedDirectoryObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "directory", pagination);
        },

        listAllocatedApplicationObjects: function(callback, pagination)
        {
            return this.listAllocatedObjects(callback, "application", pagination);
        },

        /**
         * Retrieves the default client configuration for this tenant.
         *
         * @param callback the method to receive the client configuration
         *
         * @chained this
         */
        readDefaultAllocatedClientObject: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/defaultclient";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {

                const client = {};
                Gitana.copyInto(client, response);
                Gitana.stampInto(client, Gitana.ClientMethods);
                client.get = function(key) { return this[key]; };

                callback.call(this, client);
            });
        },

        /**
         * Lists the auto-client mappings maintained for this tenant.
         *
         * @param callback the callback function
         * @param pagination
         *
         * @chained this
         */
        listAutoClientMappingObjects: function(callback, pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings";
            };

            // parameters
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback.call(this, response["rows"]);
            });
        }

    });

})(window);
