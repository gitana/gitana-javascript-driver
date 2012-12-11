(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/identities/" + identityId;
            };

            var chainable = this.getFactory().identity(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquires a list of all identities.
         *
         * @chained identity map
         *
         * @param [Pagination] pagination pagination (optional)
         */
        listIdentities: function(pagination)
        {
            var self = this;

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/identities";
            };

            // get to work
            var chainable = this.getFactory().identityMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for identities.
         *
         * @chained identity map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryIdentities: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/identities/query";
            };

            var chainable = this.getFactory().identityMap(this);
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
            var self = this;

            var object = {
                "checks": checks
            };

            var uriFunction = function()
            {
                return self.getUri() + "/identities/permissions/check";
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/connections/" + connectionId;
            };

            var chainable = this.getFactory().connection(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a connection.
         *
         * @chained connection
         *
         * @param [Object] object JSON object
         */
        createConnection: function(object)
        {
            var self = this;

            if (!object)
            {
                object = {};
            }

            var uriFunction = function()
            {
                return self.getUri() + "/connections";
            };

            var chainable = this.getFactory().connection(this, object);

            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Acquires a list of all connections.
         *
         * @chained identity map
         *
         * @param [Pagination] pagination pagination (optional)
         */
        listConnections: function(pagination)
        {
            var self = this;

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/connections";
            };

            // get to work
            var chainable = this.getFactory().connectionMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for connections.
         *
         * @chained identity map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryConnections: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/connections/query";
            };

            var chainable = this.getFactory().connectionMap(this);
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
            var self = this;

            var object = {
                "checks": checks
            };

            var uriFunction = function()
            {
                return self.getUri() + "/connections/permissions/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }



    });

})(window);
