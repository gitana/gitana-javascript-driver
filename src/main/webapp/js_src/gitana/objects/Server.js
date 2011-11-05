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

            return this.chainPostEmpty(this, "/acl/" + principalId + "/authorities/" + authorityId + "/grant");
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

            return this.chainPostEmpty(this, "/acl/" + principalId + "/authorities/" + authorityId + "/revoke");
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
         * @chained server
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

            return this.chainPostResponse(this, "/authorities", {}, json).then(function() {
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
        // CHAINING METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Acquires a list of all groups.
         *
         * @chained group map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         * @param [Object] pagination pagination (optional)
         */
        listGroups: function()
        {
            // figure out arguments
            var args = Gitana.makeArray(arguments);
            var group = null;
            var pagination = null;
            var a1 = args.shift();
            if (a1)
            {
                if (a1.objectType == "Gitana.SecurityGroup")
                {
                    group = a1;
                    pagination = args.shift();
                }
                else
                {
                    pagination = a1;
                }
            }

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // get to work
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all groups
                return this.chainGet(chainable, "/security/groups", params);
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);

                result.subchain(this /*server*/).readGroup(groupId).listGroups(params).then(function() {
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
         * Queries for groups.
         *
         * @chained principal map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryGroups: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/security/groups/query";
            };

            var chainable = this.getFactory().principalMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Acquires a list of all users.
         *
         * @chained principal map
         *
         * @param [Gitana.SecurityGroup] group optionally only look for users in a group
         * @param [Object] pagination pagination (optional)
         */
        listUsers: function()
        {
            // figure out arguments
            var args = Gitana.makeArray(arguments);
            var group = null;
            var pagination = null;
            var a1 = args.shift();
            if (a1)
            {
                if (a1.objectType == "Gitana.SecurityGroup")
                {
                    group = a1;
                    pagination = args.shift();
                }
                else
                {
                    pagination = a1;
                }
            }

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            // now get to work
            var chainable = this.getFactory().principalMap(this);

            if (!group)
            {
                // all users
                return this.chainGet(chainable, "/security/users", params);
            }
            else
            {
                // subchain that want to hand back
                var result = this.subchain(chainable);

                // now push our logic into a subchain that is the first thing in the result
                var groupId = this.extractPrincipalId(group);
                result.subchain(this /*server*/).readGroup(groupId).listUsers(params).then(function() {
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
         * Queries for users.
         *
         * @chained principal map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryUsers: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/security/users/query";
            };

            var chainable = this.getFactory().principalMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Lists repositories.
         *
         * @chained repository map
         *
         * @param [Object] pagination pagination (optional)
         */
        listRepositories: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().repositoryMap(this);
            return this.chainGet(chainable, "/repositories", params);
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
         * @param [Object] pagination pagination (optional)
         */
        queryRepositories: function(query, pagination)
        {
            var chainable = this.getFactory().repositoryMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/repositories/query", params, query);
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
        // AUTHENTICATION METHODS
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
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // JOB METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Queries for jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/query", params, query);
        },

        /**
         * Read a job.
         *
         * @chained job
         *
         * @param {String} jobId
         */
        readJob: function(jobId)
        {
            var chainable = this.getFactory().job(this);

            return this.chainGet(chainable, "/jobs/" + jobId);
        },

        /**
         * Kills a job
         *
         * @chained server
         *
         * @param {String} jobId
         */
        killJob: function(jobId)
        {
            return this.chainPostEmpty(this, "/jobs/" + jobId + "/kill");
        },

        /**
         * Queries for unstarted jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryUnstartedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/unstarted/query", params, query);
        },

        /**
         * Queries for running jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryRunningJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/running/query", params, query);
        },

        /**
         * Queries for failed jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryFailedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/failed/query", params, query);
        },

        /**
         * Queries for candidate jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryCandidateJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/candidate/query", params, query);
        },

        /**
         * Queries for finished jobs.
         *
         * @chained job map
         *
         * @param {Object} query Query for finding a job.
         * @param [Object] pagination pagination (optional)
         */
        queryFinishedJobs: function(query, pagination)
        {
            var chainable = this.getFactory().jobMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/jobs/finished/query", params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // LOGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Queries for log entries.
         *
         * @chained log entry map
         *
         * @param {Object} query Query for finding log entries.
         * @param [Object] pagination pagination (optional)
         */
        queryLogEntries: function(query, pagination)
        {
            if (!query)
            {
                query = {};
            }

            var chainable = this.getFactory().logEntryMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/logs/query", params, query);
        },

        /**
         * Read a log entry.
         *
         * @chained job
         *
         * @param {String} jobId
         */
        readLogEntry: function(logEntryId)
        {
            var chainable = this.getFactory().logEntry(this);

            return this.chainGet(chainable, "/logs/" + logEntryId);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ORGANIZATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the organizations on the server.
         *
         * @param pagination
         *
         * @chained organization map
         */
        listOrganizations: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().organizationMap(this);
            return this.chainGet(chainable, "/organizations", params);
        },

        /**
         * Reads an organization.
         *
         * @param organizationId
         *
         * @chained organization
         */
        readOrganization: function(organizationId)
        {
            var chainable = this.getFactory().organization(this);
            return this.chainGet(chainable, "/organizations/" + organizationId);
        },

        /**
         * Create an organization
         *
         * @chained organization
         *
         * @param [Object] object JSON object
         */
        createOrganization: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().organization(this);
            return this.chainCreate(chainable, object, "/organizations");
        },

        /**
         * Queries for organizations.
         *
         * @chained organization map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryOrganizations: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/organizations/query";
            };

            var chainable = this.getFactory().organizationMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        }

    });

    // STATICS
    // Special Groups

    Gitana.EVERYONE = {
        "principal-id": "EVERYONE",
        "principal-type": "GROUP"
    };

})(window);