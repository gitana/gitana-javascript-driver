(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Directory = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Directory.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Directory
         *
         * @param {Gitana.Platform} platform
         * @param {Object}object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.Directory"; };

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/directories/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DIRECTORY;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().directory(this.getPlatform(), this);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // IDENTITIES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads an identity.
         *
         * @chained identity
         *
         * @param {String} identityId the identity id
         */
        readIdentity: function(identityId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/identities/" + identityId;
            };

            const chainable = this.getFactory().identity(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of all identities.
         *
         * @chained identity map
         *
         * @param {Object} pagination pagination (optional)
         */
        listIdentities: function(pagination)
        {
            const self = this;

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/identities";
            };

            // get to work
            const chainable = this.getFactory().identityMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for identities.
         *
         * @chained identity map
         *
         * @param {Object} query
         * @param {Object}pagination pagination (optional)
         */
        queryIdentities: function(query, pagination)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/identities/query";
            };

            const chainable = this.getFactory().identityMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type identity.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkIdentityPermissions: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/identities/permissions/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type identity.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkIdentityAuthorities: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/identities/authorities/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // CONNECTIONS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads a connection.
         *
         * @chained connection
         *
         * @param {String} connectionId the connection id
         */
        readConnection: function(connectionId)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/connections/" + connectionId;
            };

            const chainable = this.getFactory().connection(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a connection.
         *
         * @chained connection
         *
         * @param {Object}object JSON object
         */
        createConnection: function(object)
        {
            const self = this;

            if (!object)
            {
                object = {};
            }

            const uriFunction = function()
            {
                return self.getUri() + "/connections";
            };

            const chainable = this.getFactory().connection(this, object);

            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Acquires a list of all connections.
         *
         * @chained identity map
         *
         * @param {Object} pagination pagination (optional)
         */
        listConnections: function(pagination)
        {
            const self = this;

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/connections";
            };

            // get to work
            const chainable = this.getFactory().connectionMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for connections.
         *
         * @chained identity map
         *
         * @param {Object} query
         * @param {Object}pagination pagination (optional)
         */
        queryConnections: function(query, pagination)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/connections/query";
            };

            const chainable = this.getFactory().connectionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type connection.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkConnectionPermissions: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/connections/permissions/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type connection.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkConnectionAuthorities: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/connections/authorities/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }

    });

})(window);
