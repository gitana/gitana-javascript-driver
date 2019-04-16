(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.DataStore = Gitana.AbstractObject.extend(
    /** @lends Gitana.DataStore.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class DataStore
         *
         * @param {Gitana} driver
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * @abstract
         */
        getUri: function()
        {
            return null;
        },

        /**
         * @abstract
         */
        getType: function()
        {
            return null;
        },

        /**
         * @abstract
         *
         * @returns {String} a string denoting a reference to this datastore
         */
        ref: function()
        {
            return this.getType() + "://" + this.getId();
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained this
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/acl/list";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/acl?id=" + principalDomainQualifiedId;
            };

            return this.chainGetResponseRows(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/check?id=" + principalDomainQualifiedId;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["check"]);
            });
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/grant?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/revoke?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        revokeAllAuthorities: function(principal)
        {
            return this.revokeAuthority(principal, "all");
        },

        /**
         * Loads the authority grants for a given set of principals.
         *
         * @chained repository
         *
         * @param principalIds
         * @param callback
         */
        loadAuthorityGrants: function(principalIds, callback)
        {
            if (!principalIds)
            {
                principalIds = [];
            }

            const json = {
                "principals": principalIds
            };

            return this.chainPostResponse(this, this.getUri() + "/authorities", {}, json).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Checks whether the given principal has a permission against this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} permissionId the id of the permission
         * @param callback
         */
        checkPermission: function(principal, permissionId, callback)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return this.getUri() + "/permissions/" + permissionId + "/check?id=" + principalDomainQualifiedId;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["check"]);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // TEAMABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads a team.
         *
         * @param teamKey
         *
         * @chainable team
         */
        readTeam: function(teamKey)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/teams/" + teamKey;
            };

            const chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Lists teams.
         *
         * @chainable map of teams
         */
        listTeams: function()
        {
            const uriFunction = function()
            {
                return this.getUri() + "/teams";
            };

            const chainable = this.getFactory().teamMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a team.
         *
         * @param teamKey
         * @param object
         *
         * @chainable team
         */
        createTeam: function(teamKey, object)
        {
            if (!object)
            {
                object = {};
            }

            const uriFunction = function()
            {
                return this.getUri() + "/teams?key=" + teamKey;
            };

            const self = this;

            const chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {

                const chain = this;

                Chain(self).readTeam(teamKey).then(function() {
                    chain.handleResponse(this);
                    chain.next();
                });

                // we manually advance the chain
                return false;
            });
        },

        /**
         * Gets the owners team
         *
         * @chained team
         */
        readOwnersTeam: function()
        {
            return this.readTeam("owners");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF TEAMABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACTIVITIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists activities.
         *
         * @chained activity map
         *
         * @param {Object} pagination pagination (optional)
         */
        listActivities: function(pagination)
        {
            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const chainable = this.getFactory().activityMap(this);
            return this.chainGet(chainable, "/activities", params);
        },

        /**
         * Read an activity.
         *
         * @chained activity
         *
         * @param {String} activityId the activity id
         */
        readActivity: function(activityId)
        {
            const chainable = this.getFactory().activity(this);
            return this.chainGet(chainable, "/activities/" + activityId);
        },

        /**
         * Queries for activities.
         *
         * @chained activity map
         *
         * @param {Object} query query.
         * @param {Object} pagination pagination (optional)
         */
        queryActivities: function(query, pagination)
        {
            const chainable = this.getFactory().activityMap(this);

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/activities/query", params, query);
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ROLE CONTAINER
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads a role.
         *
         * @param roleKeyOrId
         * @param inherited whether to check inherited role containers
         *
         * @chainable role
         */
        readRole: function(roleKeyOrId, inherited)
        {
            const params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            const uriFunction = function()
            {
                return this.getUri() + "/roles/" + roleKeyOrId;
            };

            const chainable = this.getFactory().role(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Lists roles.
         *
         * @param inherited whether to draw from inherited role containers
         *
         * @chainable map of teams
         */
        listRoles: function(inherited)
        {
            const params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            const uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            const chainable = this.getFactory().roleMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Creates a role.
         *
         * @param roleKey
         * @param object
         *
         * @chainable team
         */
        createRole: function(roleKey, object)
        {
            if (!object)
            {
                object = {};
            }
            object.roleKey = roleKey;

            const uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            const self = this;

            const chainable = this.getFactory().role(this.getPlatform(), this, roleKey);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {
                this.subchain(self).readRole(roleKey).then(function() {
                    Gitana.copyInto(chainable, this);
                });
            });
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ROLE CONTAINER
        //
        //////////////////////////////////////////////////////////////////////////////////////////





        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // COMMON DATA STORE THINGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        getMaxSize: function()
        {
            return this.get("maxSize");
        },

        getSize: function()
        {
            return this.get("size");
        },

        getObjectCount: function()
        {
            return this.get("objectcount");
        }

    });

})(window);
