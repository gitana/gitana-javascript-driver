(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Identity = Gitana.AbstractDirectoryObject.extend(
    /** @lends Gitana.Identity.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractDirectoryObject
         *
         * @class Identity
         *
         * @param {Gitana.Directory} directory
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(directory, object)
        {
            this.base(directory, object);

            this.objectType = function() { return "Gitana.Identity"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_IDENTITY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/directories/" + this.getDirectoryId() + "/identities/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().identity(this.getDirectory(), this);
        },

        /**
         * Changes the password for this identity.
         *
         * @param password
         * @param verifyPassword
         *
         * @chained this
         * @public
         */
        changePassword: function(password, verifyPassword)
        {
            const object = {
                "password": password,
                "verifyPassword": verifyPassword
            };

            return this.chainPostEmpty(null, this.getUri() + "/changepassword", {}, object);
        },

        /**
         * Retrieves a list of all of the users on any domain that have this identity applied to them.
         *
         * @param tenantId
         */
        findPolicyUsers: function(tenantId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/policy/users";
            };

            const domain = new Gitana.Domain(this.getPlatform());

            const chainable = this.getFactory().domainPrincipalMap(domain);

            // prepare params
            const params = {};
            if (tenantId)
            {
                params.tenantId = tenantId;
            }

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Finds the user on a tenant platform that has this identity.
         * If multiple users have this identity, the first one is chosen.
         *
         * @param tenantId
         */
        findPolicyUserForTenant: function(tenantId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/policy/user";
            };

            const chainable = this.getFactory().domainPrincipal(this);

            // prepare params (with pagination)
            const params = {};
            params["tenantId"] = tenantId;

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Finds the user on a tenant platform that has this identity.
         * If multiple users have this identity, the first one is chosen.
         *
         * @param tenantId
         */
        findPolicyUsersForTenant: function(tenantId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/policy/users";
            };

            const chainable = this.getFactory().domainPrincipalMap(this);

            // prepare params (with pagination)
            const params = {};
            params["tenantId"] = tenantId;

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves the tenants that this identity participates in.
         * Optionally allows you to filter down to a particular registrar.
         *
         * @chained principal map
         *
         * @param {String} registrarId
         */
        findPolicyTenants: function(registrarId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/policy/tenants";
            };

            const chainable = this.getFactory().tenantMap(this);

            // prepare params
            const params = {};
            if (registrarId)
            {
                params["registrarId"] = registrarId;
            }

            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
