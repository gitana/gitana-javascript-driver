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

            this.objectType = "Gitana.Identity";


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
            return this.getFactory().identity(this.getDirectory(), this.object);
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
         * @param pagination
         */
        findUsers: function(pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/users";
            };

            var chainable = this.getFactory().domainPrincipalMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Finds the user on a tenant platform that has this identity.
         * If multiple users have this identity, the first one is chosen.
         *
         * @param pagination
         */
        findUserForTenant: function(tenantId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/user";
            };

            var chainable = this.getFactory().domainPrincipal(this);

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
         * @param [Pagination] pagination optional pagination
         */
        findTenants: function(registrarId, pagination)
        {
            var self = this;

            var registrarId = null;
            var pagination = null;

            if (arguments.length == 0)
            {
                // nothing to do
            }
            else if (arguments.length == 1)
            {
                var arg1 = arguments[0];
                if (Gitana.isString(arg1))
                {
                    registrarId = arguments[0];
                }
                else
                {
                    pagination = arguments[1];
                }
            }
            else
            {
                registrarId = arguments[0];
                pagination = arguments[1];
            }

            var uriFunction = function()
            {
                return self.getUri() + "/tenants";
            };

            var chainable = this.getFactory().tenantMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (registrarId)
            {
                params["registrarId"] = registrarId;
            }

            return this.chainGet(chainable, uriFunction, params);
        }

    });

})(window);
