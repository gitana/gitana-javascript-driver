(function(window)
{
    Gitana = window.Gitana;

    Gitana.Server = Gitana.Chainable.extend(
    /** @lends Gitana.Server.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Gitana server object
         */
        constructor: function(driver)
        {
            this.base(driver);

            this.objectType = "Gitana.Server";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().server(this.getDriver());
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
            return this.chainGetResponse(this, "/acl").then(function() {
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

            return this.chainGetResponseRows(this, "/acl/" + principalId).then(function() {
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

            return this.chainHasResponseRow(this, "/acl/" + principalId, authorityId).then(function() {
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

            return this.chainPostEmpty(this, "/acl/" + principalId + "/grant/" + authorityId);
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

            return this.chainPostEmpty(this, "/acl/" + principalId + "/revoke/" + authorityId);
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

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////






        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CHAINING METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all groups.
         *
         * @chained group map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         */
        listGroups: function(group)
        {
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all groups
                return this.chainGet(chainable, "/security/groups");
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);

                result.subchain(this /*server*/).readGroup(groupId).listGroups().then(function() {
                    result.handleResponse(this.object);
                });

                return result;
            }
        },

        /**
         * Reads a group
         *
         * @chained group
         *
         * @param {String} groupId the group id
         */
        readGroup: function(groupId)
        {
            var chainable = this.getFactory().securityGroup(this);
            return this.chainGet(chainable, "/security/groups/" + groupId);
        },

        /**
         * Create a group.
         *
         * @chained group
         *
         * @param {String} groupId the group id
         * @param [Object] object JSON object
         */
        createGroup: function(groupId, object)
        {
            if (!object)
            {
                object = {};
            }
            object["principal-id"] = groupId;
            object["principal-type"] = "group";

            var chainable = this.getFactory().securityGroup(this);
            return this.chainCreateEx(chainable, object, "/security/groups", "/security/groups/" + groupId);
        },

        /**
         * Acquires a list of all users.
         *
         * @chained principal map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         */
        listUsers: function(group)
        {
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all users
                return this.chainGet(chainable, "/security/users");
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);
                result.subchain(this /*server*/).readGroup(groupId).listUsers().then(function() {
                    result.handleResponse(this.object);
                });

                return result;
            }
        },

        /**
         * Reads a user
         *
         * @chained user
         *
         * @param {String} userId the user id
         */
        readUser: function(userId)
        {
            var chainable = this.getFactory().securityUser(this);
            return this.chainGet(chainable, "/security/users/" + userId);
        },

        /**
         * Create a user.
         *
         * @chained user
         *
         * @param {String} userId user id
         * @param [Object] object JSON object
         */
        createUser: function(userId, object)
        {
            var self = this;

            if (!object)
            {
                object = {};
            }
            object["principal-id"] = userId;
            object["principal-type"] = "user";

            var chainable = this.getFactory().securityUser(this);
            return this.chainCreateEx(chainable, object, "/security/users", "/security/users/" + userId);
        },

        /**
         * Lists repositories.
         *
         * @chained repository map
         */
        listRepositories: function()
        {
            var chainable = this.getFactory().repositoryMap(this);
            return this.chainGet(chainable, "/repositories");
        },

        /**
         * Read a repository.
         *
         * @chained repository
         *
         * @param {String} repositoryId the repository id
         */
        readRepository: function(repositoryId)
        {
            var chainable = this.getFactory().repository(this);
            return this.chainGet(chainable, "/repositories/" + repositoryId);
        },

        /**
         * Create a repository
         *
         * @chained repository
         *
         * @param [Object] object JSON object
         */
        createRepository: function(object)
        {
            var chainable = this.getFactory().repository(this);
            return this.chainCreate(chainable, object, "/repositories");
        },

        /**
         * Queries for a repository.
         *
         * @chained repository map
         *
         * @param {Object} query Query for finding a repository.
         */
        queryRepositories: function(query)
        {
            var chainable = this.getFactory().repositoryMap(this);
            return this.chainPost(chainable, "/repositories/query", query);
        },

        /**
         * Adds a principal as a member of a group
         *
         * @chained server
         *
         * @public
         *
         * @param {Gitana.Principal|String} group the group or the group id
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        addMember: function(group, principal)
        {
            var groupId = this.extractPrincipalId(group);
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + groupId + "/add/" + principalId);
        },

        /**
         * Removes a principal as a member of a group.
         *
         * @chained server
         *
         * @public
         *
         * @param {Gitana.Principal|String} group the group or the group id
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        removeMember: function(group, principal)
        {
            var groupId = this.extractPrincipalId(group);
            var principalId = this.extractPrincipalId(principal);

            return this.chainPostEmpty(this, "/security/groups/" + groupId + "/remove/" + principalId);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Logs in as the given user.
         *
         * This delegates a call to the underlying driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] authentication failure handler
         */
        authenticate: function(username, password, authFailureHandler)
        {
            return this.getDriver().authenticate(username, password, authFailureHandler);
        },

        /**
         * Clears authentication against the server.
         *
         * @chained server
         *
         * @public
         */
        logout: function()
        {
            var self = this;

            var result = this.subchain(this);

            result.subchain().then(function() {
                self.getDriver().clearAuthentication();
            });

            return result;
        }

    });

    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

})(window);