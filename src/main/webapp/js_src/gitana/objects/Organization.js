(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Organization = Gitana.AbstractObject.extend(
    /** @lends Gitana.Organization.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Job
         *
         * @param {Gitana.Server} server
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(server, object)
        {
            this.base(server, object);

            this.objectType = "Gitana.Organization";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/organizations/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().organization(this.getServer(), this.object);
        },

        /**
         * Delete
         *
         * @chained server
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return "/organizations/" + this.getId();
            };

            // NOTE: pass control back to the server instance
            return this.chainDelete(this.getServer(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained security group
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/organizations/" + this.getId();
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update
         *
         * @chained security group
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/organizations/" + this.getId();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained server
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            var uriFunction = function()
            {
                return "/organizations/" + this.getId() + "/acl";
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param callback
         */
        listAuthorities: function(principal, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/organizations/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainGetResponseRows(this, uriFunction).then(function() {
                callback.call(this, this.response);
            });
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/organizations/" + this.getId() + "/acl/" + principalId;
            };

            return this.chainHasResponseRow(this, uriFunction, authorityId).then(function() {
                callback.call(this, this.response)
            })
        },

        /**
         * Grants an authority to a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        grantAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/organizations/" + this.getId() + "/acl/" + principalId + "/authorities/" + authorityId + "/grant";
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Revokes an authority from a principal against this object.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         */
        revokeAuthority: function(principal, authorityId)
        {
            var principalId = this.extractPrincipalId(principal);

            var uriFunction = function()
            {
                return "/organizations/" + this.getId() + "/acl/" + principalId + "/authorities/" + authorityId + "/revoke";
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
         * @chained organization
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

            return this.chainPostResponse(this, "/organizations/" + this.getId() + "/authorities", {}, json).then(function() {
                callback.call(this, this.response);
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

            var chainable = this.getFactory().team(this.getServer(), this, teamKey);
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

            var chainable = this.getFactory().teamMap(this.getServer(), this);
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

            var chainable = this.getFactory().team(this.getServer(), this, teamKey);
            return this.chainCreate(chainable, object, uriFunction);
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

        /**
         * Assigns a repository to this organization.
         *
         * @param repositoryId
         *
         * @chained organization
         */
        assignRepository: function(repositoryId)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/teams/" + this.getKey() + "/repositories/" + repositoryId + "/assign";
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Unassigns a repository from this organization.
         *
         * @param repositoryId
         *
         * @chained organization
         */
        unassignRepository: function(repositoryId)
        {
            var uriFunction = function()
            {
                return this.getUri() + "/teams/" + this.getKey() + "/repositories/" + repositoryId + "/unassign";
            };

            return this.chainPostEmpty(this, uriFunction);
        },

        /**
         * Lists the assigned repository ids for this organization.
         */
        getAssignedRepositoryIds: function()
        {
            return this.get("repositories");
        }

    });

})(window);
