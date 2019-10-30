(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Domain = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Domain.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Domain
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Domain"; };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/domains/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DOMAIN;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().domain(this.getPlatform(), this);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // PRINCIPALS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all principals.
         *
         * @chained principal map
         *
         * @param {Object} pagination pagination (optional)
         * @param {Object} options
         */
        listPrincipals: function(pagination, options)
        {
            const self = this;

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // options: see readPrincipal()
            if (options)
            {
                Gitana.copyInto(params, options);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/principals";
            };

            // get to work
            const chainable = this.getFactory().domainPrincipalMap(this);

            // all groups
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a principal.
         *
         * The options object is optional and can specify additional arguments for the retrieval.
         * This can look like:
         *
         *    {
         *      "groups": undefined | "direct" | "indirect"
         *    }
         *
         * @chained principal
         *
         * @param {String} principalId the principal id
         * @param {Object} options
         */
        readPrincipal: function(principalId, options)
        {
            const self = this;

            const params = {};
            if (options)
            {
                Gitana.copyInto(params, options);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/principals/" + principalId;
            };

            const chainable = this.getFactory().domainPrincipal(this);

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Create a principal.
         *
         * @chained principal
         *
         * @param {Object} object JSON object
         */
        createPrincipal: function(object)
        {
            const self = this;

            if (!object)
            {
                object = {};
            }

            if (!object.name)
            {
                // TODO: error - requires name
                console.log("missing name");
                return;
            }

            if (!object.type)
            {
                // TODO: error - requires type
                console.log("missing type");
                return;
            }

            const uriFunction = function()
            {
                return self.getUri() + "/principals";
            };

            const chainable = this.getFactory().domainPrincipal(this, object);

            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Queries for principals.
         *
         * @chained principal map
         *
         * @param {Object} query
         * @param {Object} pagination pagination (optional)
         * @param {Object} options
         */
        queryPrincipals: function(query, pagination, options = undefined)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // options: see readPrincipal()
            if (options)
            {
                Gitana.copyInto(params, options);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/principals/query";
            };

            const chainable = this.getFactory().domainPrincipalMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // GROUPS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all groups in the domain.
         *
         * @chained group map
         *
         * @param {Object} pagination pagination (optional)
         */
        listGroups: function(pagination)
        {
            const query = {
                "type": "GROUP"
            };

            return this.queryPrincipals(query, pagination);
        },

        /**
         * Create a group.
         *
         * @chained group
         *
         * @param {Object} object JSON object
         */
        createGroup: function(object)
        {
            if (!object)
            {
                object = {};
            }
            object["type"] = "GROUP";

            return this.createPrincipal(object);
        },

        /**
         * Queries for groups.
         *
         * @chained principal map
         *
         * @param {Object} query
         * @param {Object} pagination pagination (optional)
         */
        queryGroups: function(query, pagination)
        {
            if (!query)
            {
                query = {};
            }
            query["type"] = "GROUP";

            return this.queryPrincipals(query, pagination);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // USERS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all users.
         *
         * @chained user map
         *
         * @param {Object} pagination pagination (optional)
         */
        listUsers: function(pagination)
        {
            const query = {
                "type": "USER"
            };

            return this.queryPrincipals(query, pagination);
        },

        /**
         * Create a user.
         *
         * @chained user
         *
         * @param {Object} object JSON object
         */
        createUser: function(object)
        {
            if (!object)
            {
                object = {};
            }
            object["type"] = "USER";

            return this.createPrincipal(object);
        },

        /**
         * Queries for users.
         *
         * @chained principal map
         *
         * @param {Object} query
         * @param {Object} pagination pagination (optional)
         */
        queryUsers: function(query, pagination)
        {
            if (!query)
            {
                query = {};
            }
            query["type"] = "USER";

            return this.queryPrincipals(query, pagination);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // MEMBERSHIPS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Adds a principal as a member of a group
         *
         * @chained domain
         *
         * @public
         *
         * @param {Gitana.DomainGroup|String} group the group or the group id
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         */
        addMember: function(group, principal)
        {
            const self = this;

            const groupId = this.extractPrincipalIdentifiers(group, this.getId())["principal"];
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return self.getUri() + "/principals/" + groupId + "/members/add?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Removes a principal as a member of a group.
         *
         * @chained domain
         *
         * @public
         *
         * @param {Gitana.DomainGroup|String} group the group or the group id
         * @param {Gitana.DomainPrincipal|String} principal the principal or the principal id
         */
        removeMember: function(group, principal)
        {
            const self = this;

            const groupId = this.extractPrincipalIdentifiers(group, this.getId())["principal"];
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return self.getUri() + "/principals/" + groupId + "/members/remove?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Acquires a list of all of the members who are in this group.
         *
         * @chained principal map
         *
         * @public
         *
         * @param {Object} group
         * @param {String} filter type of principal to hand back ("user" or "group")
         * @param {Object} pagination
         * @param {Boolean} indirect whether to include members that inherit through child groups
         */
        listMembers: function(group, filter, pagination, indirect)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }
            if (filter)
            {
                params["filter"] = filter;
            }
            if (indirect)
            {
                params["indirect"] = true;
            }

            const groupId = this.extractPrincipalIdentifiers(group, this.getId())["principal"];

            const uriFunction = function()
            {
                return self.getUri() + "/principals/" + groupId + "/members";
            };

            const chainable = this.getFactory().domainPrincipalMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // BULK PERMISSIONS CHECK
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Performs a bulk check of permissions against permissioned objects of type principal.
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
        checkPrincipalPermissions: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/principals/permissions/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type principal.
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
        checkPrincipalAuthorities: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/principals/authorities/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check to determine whether a given principal is a member of a given group.  Multiple checks
         * may be performed at the same time (both direct and indirect).
         *
         * Example of checks array:
         *
         * [{
         *    "principalId": "<principalId>",
         *    "groupId": "<groupId>",
         *    "indirect": <indirect>
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "principalId": "<principalId>",
         *    "groupId": "<groupId>",
         *    "indirect": <indirect>,
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkGroupMemberships: function(checks, callback)
        {
            const self = this;

            const object = {
                "checks": checks
            };

            const uriFunction = function()
            {
                return self.getUri() + "/principals/membership/check";
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }

    });

})(window);
