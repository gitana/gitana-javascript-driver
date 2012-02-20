(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Tenant = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Tenant.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Tenant
         *
         * @param {Gitana.Registrar} registrar
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar.getPlatform(), object);

            this.objectType = "Gitana.Tenant";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getRegistrar = function()
            {
                return registrar;
            };

            this.getRegistrarId = function()
            {
                return registrar.getId();
            };

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
            return this.getFactory().tenant(this.getRegistrar(), this.object);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getPlatform().getUri() + "/registrars/" + self.getRegistrarId() + "/plans/" + self.getPlanKey();
            };

            var chainable = this.getFactory().plan(this.getRegistrar());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Hands back the principal that owns this tenant.
         *
         * @chained principal
         */
        readTenantPrincipal: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getPlatform().getUri() + "/domains/" + self.getPrincipalDomainId() + "/principals/" + self.getPrincipalId();
            };

            // TODO - this is a pretty big hack at the moment
            var domain = this.getFactory().domain(this.getPlatform(), {
                "_doc": this.getPrincipalDomainId()
            });

            var chainable = this.getFactory().domainPrincipal(domain);
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
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the allocations on the server.
         *
         * @param pagination
         * @param callback the callback function
         *
         * @chained this
         */
        lookupAllocatedObjects: function(pagination, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/objects";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function() {
                callback.call(this, this.response["rows"]);
            });
        },

        /**
         * Retrieves the default client configuration for this tenant.
         *
         * @param callback the method to receive the client configuration
         *
         * @chained this
         */
        loadDefaultClient: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/defaultclient";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function() {

                var client = {};
                Gitana.copyInto(client, this.response);
                Gitana.stampInto(client, Gitana.ClientMethods);
                client.get = function(key) { return this[key]; };

                callback.call(this, client);
            });
        }

    });

})(window);
