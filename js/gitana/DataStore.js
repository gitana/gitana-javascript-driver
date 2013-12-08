(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * @ABSTRACT
         *
         * To be implemented by data store implementations.
         */
        getUri: function()
        {
            return null;
        },

        /**
         * @ABSTRACT
         *
         * To be implemented by data store implementations.
         */
        getType: function()
        {
            return null;
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
            var uriFunction = function()
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
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
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
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
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
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/grant?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
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
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return this.getUri() + "/authorities/" + authorityId + "/revoke?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(this, uriFunction);
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
         * @param callback
         */
        loadAuthorityGrants: function(principalIds, callback)
        {
            if (!principalIds)
            {
                principalIds = [];
            }

            var json = {
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
            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
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
            var uriFunction = function()
            {
                return this.getUri() + "/teams/" + teamKey;
            };

            var chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Lists teams.
         *
         * @chainable map of teams
         */
        listTeams: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/teams";
            };

            var chainable = this.getFactory().teamMap(this.getCluster(), this);
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

            var uriFunction = function()
            {
                return this.getUri() + "/teams?key=" + teamKey;
            };

            var self = this;

            var chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {
                this.subchain(self).readTeam(teamKey).then(function() {
                    Gitana.copyInto(chainable, this);
                });
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
         * @param [Object] pagination pagination (optional)
         */
        listActivities: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().activityMap(this);
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
            var chainable = this.getFactory().activity(this);
            return this.chainGet(chainable, "/activities/" + activityId);
        },

        /**
         * Queries for activities.
         *
         * @chained activity map
         *
         * @param {Object} query query.
         * @param [Object] pagination pagination (optional)
         */
        queryActivities: function(query, pagination)
        {
            var chainable = this.getFactory().activityMap(this);

            // prepare params (with pagination)
            var params = {};
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
            var params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            var uriFunction = function()
            {
                return this.getUri() + "/roles/" + roleKeyOrId;
            };

            var chainable = this.getFactory().role(this.getCluster(), this);
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
            var params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            var uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            var chainable = this.getFactory().roleMap(this.getCluster(), this);
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

            var uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            var self = this;

            var chainable = this.getFactory().role(this.getPlatform(), this, roleKey);
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
