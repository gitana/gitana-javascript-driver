(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Identity = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Identity.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Identity
         *
         * @param {Gitana.Directory} directory
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(directory, object)
        {
            this.base(directory.getPlatform(), object);

            this.objectType = function() { return "Gitana.Identity"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getDirectory = function()
            {
                return directory;
            };

            this.getDirectoryId = function()
            {
                return directory.getId();
            };
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
            var object = {
                "password": password,
                "verifyPassword": verifyPassword
            };

            return this.chainPostEmpty(this, this.getUri() + "/changepassword", {}, object);
        },

        /**
         * Retrieves a list of all of the users on any domain that have this identity applied to them.
         *
         * @param tenantId
         */
        findPolicyUsers: function(tenantId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/policy/users";
            };

            var domain = new Gitana.Domain(this.getPlatform());

            var chainable = this.getFactory().domainPrincipalMap(domain);

            // prepare params
            var params = {};
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
         * @param pagination
         */
        findPolicyUserForTenant: function(tenantId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/policy/user";
            };

            var chainable = this.getFactory().domainPrincipal(this);

            // prepare params (with pagination)
            var params = {};
            params["tenantId"] = tenantId;

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Finds the user on a tenant platform that has this identity.
         * If multiple users have this identity, the first one is chosen.
         *
         * @param pagination
         */
        findPolicyUsersForTenant: function(tenantId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/policy/users";
            };

            var chainable = this.getFactory().domainPrincipalMap(this);

            // prepare params (with pagination)
            var params = {};
            params["tenantId"] = tenantId;

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves the tenants that this identity participates in.
         * Optionally allows you to filter down to a particular registrar.
         *
         * @chained principal map
         *
         * @param [String] registrarId
         */
        findPolicyTenants: function(registrarId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/policy/tenants";
            };

            var chainable = this.getFactory().tenantMap(this);

            // prepare params
            var params = {};
            if (registrarId)
            {
                params["registrarId"] = registrarId;
            }

            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
