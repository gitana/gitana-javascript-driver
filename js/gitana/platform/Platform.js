(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Platform = Gitana.ContainedDataStore.extend(
    /** @lends Gitana.Platform.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class Platform
         *
         * @param {Gitana.Cluster} cluster
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(cluster, object)
        {
            this.objectType = function() { return "Gitana.Platform"; };

            this.base(cluster, object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getCluster = function()
            {
                return cluster;
            };

            this.getClusterId = function()
            {
                return cluster.getId();
            };

        },

        /**
         * This method is provided to make the platform datastore compatible for teams.
         */
        getPlatform: function()
        {
            return this;
        },

        /**
         * Reads the cluster.
         *
         * @chained cluster
         */
        readCluster: function()
        {
            return this.subchain(this.getCluster());
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "";
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_PLATFORM;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().platform(this.getCluster(), this);
        },

        /** @Override **/
        del: function()
        {
            // not implemented
            return this;
        },

        /** @Override **/
        reload: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/";
            };

            return this.chainReload(null, uriFunction);
        },

        /** @Override **/
        update: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/";
            };

            return this.chainUpdate(null, uriFunction);
        },

        /**
         * Hands back the primary domain instance for this platform.
         *
         * @chained domain
         */
        readPrimaryDomain: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/domains/primary";
            };

            var chainable = this.getFactory().domain(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Loads information about the platform.
         *
         * @param callback
         */
        loadInfo: function(callback)
        {
            var uriFunction = function()
            {
                return "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // REPOSITORIES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

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
         * Performs a bulk check of permissions against permissioned objects of type repository.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
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
        checkRepositoryPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type repository.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "domainId": "<domainId>", (optional)
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
        checkRepositoryAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DOMAINS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists domains.
         *
         * @chained domain map
         *
         * @param [Object] pagination pagination (optional)
         */
        listDomains: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().domainMap(this);
            return this.chainGet(chainable, "/domains", params);
        },

        /**
         * Read a domain.
         *
         * @chained domain
         *
         * @param {String} domainId the domain id
         */
        readDomain: function(domainId)
        {
            var chainable = this.getFactory().domain(this);
            return this.chainGet(chainable, "/domains/" + domainId);
        },

        /**
         * Create a domain
         *
         * @chained domain
         *
         * @param [Object] object JSON object
         */
        createDomain: function(object)
        {
            var chainable = this.getFactory().domain(this);
            return this.chainCreate(chainable, object, "/domains");
        },

        /**
         * Queries for a domain.
         *
         * @chained domain map
         *
         * @param {Object} query Query for finding a domain.
         * @param [Object] pagination pagination (optional)
         */
        queryDomains: function(query, pagination)
        {
            var chainable = this.getFactory().domainMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/domains/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type domain.
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
        checkDomainPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/domains/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type domain.
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
        checkDomainAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/domains/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },





        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // VAULTS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists vaults.
         *
         * @chained vault map
         *
         * @param [Object] pagination pagination (optional)
         */
        listVaults: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().vaultMap(this);
            return this.chainGet(chainable, "/vaults", params);
        },

        /**
         * Read a vault.
         *
         * @chained vault
         *
         * @param {String} vaultId the vault id
         */
        readVault: function(vaultId)
        {
            var chainable = this.getFactory().vault(this);
            return this.chainGet(chainable, "/vaults/" + vaultId);
        },

        /**
         * Create a vault
         *
         * @chained vault
         *
         * @param [Object] object JSON object
         */
        createVault: function(object)
        {
            var chainable = this.getFactory().vault(this);
            return this.chainCreate(chainable, object, "/vaults");
        },

        /**
         * Queries for a vault.
         *
         * @chained vault map
         *
         * @param {Object} query Query for finding a vault.
         * @param [Object] pagination pagination (optional)
         */
        queryVaults: function(query, pagination)
        {
            var chainable = this.getFactory().vaultMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/vaults/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type vault.
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
        checkVaultPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/vaults/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type vault.
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
        checkVaultAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/vaults/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
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
         * @param {Object} config login config
         * @param [Function] authentication failure handler
         */
        authenticate: function(config, authFailureHandler)
        {
            return this.getDriver().authenticate(config, authFailureHandler);
        },

        /**
         * Clears authentication against the server.
         *
         * @param expireAccessToken (optional, assumed false)
         *
         * @chained server
         *
         * @public
         */
        logout: function(expireAccessToken)
        {
            var self = this;

            return this.subchain().then(function() {

                var platformCacheKey = this.getDriver().platformCacheKey;
                if (platformCacheKey)
                {
                    Gitana.disconnect(platformCacheKey, expireAccessToken);
                }

                this.getDriver().clearAuthentication();

                delete this.getDriver().platformCacheKey;
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // STACKS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the stacks.
         *
         * @param pagination
         *
         * @chained stack map
         */
        listStacks: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().stackMap(this);
            return this.chainGet(chainable, "/stacks", params);
        },

        /**
         * Reads a stack.
         *
         * @param stackId
         *
         * @chained stack
         */
        readStack: function(stackId)
        {
            var chainable = this.getFactory().stack(this);
            return this.chainGet(chainable, "/stacks/" + stackId);
        },

        /**
         * Create a stack
         *
         * @chained stack
         *
         * @param [Object] object JSON object
         */
        createStack: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().stack(this);
            return this.chainCreate(chainable, object, "/stacks");
        },

        /**
         * Queries for stacks.
         *
         * @chained stack map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryStacks: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/stacks/query";
            };

            var chainable = this.getFactory().stackMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Finds a stack for a given data store.
         *
         * @param datastoreType
         * @param datastoreId
         *
         * @chained stack
         */
        findStackForDataStore: function(datastoreType, datastoreId)
        {
            var chainable = this.getFactory().stack(this);
            return this.chainGet(chainable, "/stacks/find/" + datastoreType + "/" + datastoreId);
        },


        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
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
        checkStackPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/stacks/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type stack.
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
        checkStackAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/stacks/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },





        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // PROJECTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the projects.
         *
         * @param pagination
         *
         * @chained project map
         */
        listProjects: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().projectMap(this);
            return this.chainGet(chainable, "/projects", params);
        },

        /**
         * Reads a project.
         *
         * @param projectId
         *
         * @chained project
         */
        readProject: function(projectId)
        {
            var chainable = this.getFactory().project(this);
            return this.chainGet(chainable, "/projects/" + projectId);
        },

        /**
         * Create a project
         *
         * @chained project
         *
         * @param [Object] object JSON object
         */
        createProject: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().project(this);
            return this.chainCreate(chainable, object, "/projects");
        },

        /**
         * Create a project asynchronously.
         * This runs a background job to do the actual project creation and hands back a job ID.
         *
         * @chained project
         *
         * @param [Object] object JSON object
         * @param [Object] params request parameters
         */
        startCreateProject: function(object, params, callback)
        {
            var uriFunction = function()
            {
                return "/projects/start";
            };

            if (!object)
            {
                object = {};
            }

            if (!params)
            {
                params = {};
            }

            return this.chainPostResponse(this, uriFunction, params, object).then(function(response) {

                var jobId = response._doc;

                callback(jobId);
            });
        },

        /**
         * Queries for projects.
         *
         * @chained project map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryProjects: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/projects/query";
            };

            var chainable = this.getFactory().projectMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type project.
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
        checkProjectPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/projects/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type project.
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
        checkProjectAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/projects/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PROJECT TYPES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the project types available for this platform.
         *
         * @chained project type map
         *
         * @param [Object] pagination pagination (optional)
         */
        listProjectTypes: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().projectMap(this);
            return this.chainGet(chainable, "/projecttypes", params);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/logs/query";
            };

            if (!query)
            {
                query = {};
            }

            var chainable = this.getFactory().logEntryMap(this.getCluster());

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Read a log entry.
         *
         * @chained log entry
         *
         * @param {String} logEntryId
         */
        readLogEntry: function(logEntryId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/logs/" + logEntryId;
            };

            var chainable = this.getFactory().logEntry(this.getCluster());

            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads the last 100 lines of the log as text.
         * The callback receives the text as the argument.
         *
         * @param callback
         */
        readLog: function(callback)
        {
            var self = this;

            var uriFunction = function () {
                return "/logs/logfile";
            };

            return this.chainGetResponseText(this, uriFunction).then(function(text) {
                callback.call(this, text);
            });
        },

        /**
         * Creates and reads back a log entry.
         *
         * @param message
         * @param level
         * @param obj
         */
        createLogEntry: function(message, level, obj)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/logs";
            };

            if (!obj) {
                obj = {};
            }
            obj.message = message;
            obj.level = level;

            var chainable = this.getFactory().logEntry(this.getCluster());
            return this.chainCreate(chainable, obj, "/logs");
        },

        /**
         * Performs a blind post create of a log entry.  The result is not read back nor handled.
         *
         * @param message
         * @param level
         * @param obj
         */
        postLogEntry: function(message, level, obj)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/logs";
            };

            if (!obj) {
                obj = {};
            }
            obj.message = message;
            obj.level = level;

            return this.chainPostEmpty(null, uriFunction, {}, obj, "application/json");
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // REGISTRARS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists registrars.
         *
         * @chained registrar map
         *
         * @param [Object] pagination pagination (optional)
         */
        listRegistrars: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().registrarMap(this);
            return this.chainGet(chainable, "/registrars", params);
        },

        /**
         * Read a registrar.
         *
         * @chained registrar
         *
         * @param {String} registrarId the registrar id
         */
        readRegistrar: function(registrarId)
        {
            var chainable = this.getFactory().registrar(this);
            return this.chainGet(chainable, "/registrars/" + registrarId);
        },

        /**
         * Create a registrar
         *
         * @chained registrar
         *
         * @param [Object] object JSON object
         */
        createRegistrar: function(object)
        {
            var chainable = this.getFactory().registrar(this);
            return this.chainCreate(chainable, object, "/registrars");
        },

        /**
         * Queries for a registrar.
         *
         * @chained registrar map
         *
         * @param {Object} query Query for finding a vault.
         * @param [Object] pagination pagination (optional)
         */
        queryRegistrars: function(query, pagination)
        {
            var chainable = this.getFactory().registrarMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/registrars/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type vault.
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
        checkRegistrarPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/registrars/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type vault.
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
        checkRegistrarAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/registrars/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // APPLICATIONS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists applications.
         *
         * @chained application map
         *
         * @param [Object] pagination pagination (optional)
         */
        listApplications: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().applicationMap(this);
            return this.chainGet(chainable, "/applications", params);
        },

        /**
         * Read an application.
         *
         * @chained application
         *
         * @param {String} applicationId the application id
         */
        readApplication: function(applicationId)
        {
            var uriFunction = function() {
                return "/applications/" + applicationId;
            };

            var chainable = this.getFactory().application(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Create an application
         *
         * @chained application
         *
         * @param [Object] object JSON object
         */
        createApplication: function(object)
        {
            var chainable = this.getFactory().application(this);
            return this.chainCreate(chainable, object, "/applications");
        },

        /**
         * Queries for an application.
         *
         * @chained application map
         *
         * @param {Object} query Query for finding a vault.
         * @param [Object] pagination pagination (optional)
         */
        queryApplications: function(query, pagination)
        {
            var chainable = this.getFactory().applicationMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/applications/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type vault.
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
        checkApplicationPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/applications/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type vault.
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
        checkApplicationAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/applications/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // APPLICATION TYPES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the application types available for this platform.
         *
         * @chained application type map
         *
         * @param [Object] pagination pagination (optional)
         */
        listApplicationTypes: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().applicationMap(this);
            return this.chainGet(chainable, "/applicationtypes", params);
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CLIENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the clients.
         *
         * @param pagination
         *
         * @chained client map
         */
        listClients: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().clientMap(this);
            return this.chainGet(chainable, "/clients", params);
        },

        /**
         * Reads a client.
         *
         * @param clientId
         *
         * @chained client
         */
        readClient: function(clientId)
        {
            var chainable = this.getFactory().client(this);
            return this.chainGet(chainable, "/clients/" + clientId);
        },

        /**
         * Create a client
         *
         * @chained client
         *
         * @param [Object] object JSON object
         */
        createClient: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().client(this);
            return this.chainCreate(chainable, object, "/clients");
        },

        /**
         * Queries for clients.
         *
         * @chained client map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryClients: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/clients/query";
            };

            var chainable = this.getFactory().clientMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type client.
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
        checkClientPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/clients/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type client.
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
        checkClientAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/clients/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESS POLICIES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads an access policy.
         * 
         * @param {String} accessPolicyId 
         * 
         * @chained accessPolicy
         */
        readAccessPolicy: function(accessPolicyId)
        {
            var chainable = this.getFactory().accessPolicy(this);
            return this.chainGet(chainable, "/access/policies/" + accessPolicyId);
        },

        /**
         * Create an Access Policy
         * 
         * @param {Object} object 
         * 
         * @chained accessPolicy
         */
        createAccessPolicy: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().accessPolicy(this);
            return this.chainCreate(chainable, object, "/access/policies");
        },

        /**
         * List all Access Policies in the platform.
         * 
         * @param {Object} pagination 
         * 
         * @chained accessPolicyMap
         */
        listAccessPolicies: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            params.clientId = this.getId();

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainGet(chainable, "/access/policies", params);
        },

        /**
         * Query for Access Policies.
         * 
         * @param {Object} query 
         * @param {Object} pagination 
         * 
         * @chained accessPolicyMap
         */
        queryAccessPolicies: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainPost(chainable, "/access/policies/query", params, query);
        },

        /**
         * Finds Access Policies bound to a particular resource.
         * 
         * @param {String} ref 
         * @param {Object} pagination 
         * 
         * @chained accessPolicyMap
         */
        findAccessPolicies: function(ref, pagination)
        {
            var params = {};
            params.ref = ref;

            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainPost(chainable, "/access/policies/find", params);
        },

        /**
         * Assign an access policy to a particular resource.
         * 
         * @param {String} accessPolicyId 
         * @param {String} ref 
         */
        assignAccessPolicy: function(accessPolicyId, ref)
        {
            var params = {};
            params.ref = ref;

            var uri = "/access/policies/" + accessPolicyId + "/assign";

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainPost(chainable, uri, params);
        },

        /**
         * Unassign an access policy from a particular resource.
         * 
         * @param {String} accessPolicyId 
         * @param {String} ref 
         */
        unassignAccessPolicy: function(accessPolicyId, ref)
        {
            var params = {};
            params.ref = ref;

            var uri = "/access/policies/" + accessPolicyId + "/unassign";

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainPost(chainable, uri, params);
        },

        /**
         * Unassign all access policies from a particular resource.
         * 
         * @param {String} ref 
         */
        unassignAllAccessPolicies: function(ref)
        {
            var params = {};
            params.ref = ref;

            var chainable = this.getFactory().accessPolicyMap(this.getPlatform());
            return this.chainPost(chainable, "/access/policies/unassignall", params);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // AUTHENTICATION GRANTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads an authentication grant.
         *
         * @param authenticationGrantId
         *
         * @chained authentication grant
         */
        readAuthenticationGrant: function(authenticationGrantId)
        {
            var chainable = this.getFactory().authenticationGrant(this);
            return this.chainGet(chainable, "/auth/grants/" + authenticationGrantId);
        },

        /**
         * Create an authentication grant
         *
         * @chained authentication grant
         *
         * @param [Object] object JSON object
         */
        createAuthenticationGrant: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().authenticationGrant(this);
            return this.chainCreate(chainable, object, "/auth/grants");
        },

        /**
         * Queries for authentication grants.
         *
         * @chained authentication grant map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryAuthenticationGrants: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/auth/grants/query";
            };

            var chainable = this.getFactory().authenticationGrantMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type authentication grant.
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
        checkAuthenticationGrantPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/auth/grants/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type authentication grant.
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
        checkAuthenticationGrantAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/auth/grants/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },



        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DIRECTORIES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists directories.
         *
         * @chained directory map
         *
         * @param [Object] pagination pagination (optional)
         */
        listDirectories: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().directoryMap(this);
            return this.chainGet(chainable, "/directories", params);
        },

        /**
         * Read a directory.
         *
         * @chained directory
         *
         * @param {String} directoryId the directory id
         */
        readDirectory: function(directoryId)
        {
            var chainable = this.getFactory().directory(this);
            return this.chainGet(chainable, "/directories/" + directoryId);
        },

        /**
         * Create a directory.
         *
         * @chained directory
         *
         * @param [Object] object JSON object
         */
        createDirectory: function(object)
        {
            var chainable = this.getFactory().directory(this);
            return this.chainCreate(chainable, object, "/directories");
        },

        /**
         * Queries for a directory.
         *
         * @chained directory map
         *
         * @param {Object} query Query for finding a directory.
         * @param [Object] pagination pagination (optional)
         */
        queryDirectories: function(query, pagination)
        {
            var chainable = this.getFactory().directoryMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/directories/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type directory.
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
        checkDirectoryPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/directories/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type directory.
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
        checkDirectoryAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/directories/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // BILLING PROVIDER CONFIGURATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the billing provider configurations.
         *
         * @param pagination
         *
         * @chained billing provider configuration map
         */
        listBillingProviderConfigurations: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().billingProviderConfigurationMap(this);
            return this.chainGet(chainable, "/billing/configurations", params);
        },

        /**
         * Reads a billing provider configuration.
         *
         * @param billingProviderConfigurationId
         *
         * @chained billing provider configuration
         */
        readBillingProviderConfiguration: function(billingProviderConfigurationId)
        {
            var chainable = this.getFactory().billingProviderConfiguration(this);
            return this.chainGet(chainable, "/billing/configurations/" + billingProviderConfigurationId);
        },

        /**
         * Create a billing provider configuration.
         *
         * @chained billing provider configuration
         *
         * @param {String} providerId
         * @param [Object] object JSON object
         */
        createBillingProviderConfiguration: function(providerId, object)
        {
            if (!object)
            {
                object = {};
            }
            object["providerId"] = providerId;

            var chainable = this.getFactory().billingProviderConfiguration(this);
            return this.chainCreate(chainable, object, "/billing/configurations");
        },

        /**
         * Queries for billing provider configurations.
         *
         * @chained billing provider configuration map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryBillingProviderConfigurations: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/billing/configurations/query";
            };

            var chainable = this.getFactory().billingProviderConfigurationMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type billing provider configuration.
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
        checkBillingProviderConfigurationPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/billing/configurations/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type billing provider configuration.
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
        checkBillingProviderConfigurationAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/billing/configurations/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WEB HOSTS
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists web hosts.
         *
         * @chained web host map
         *
         * @param [Object] pagination pagination (optional)
         */
        listWebHosts: function(pagination)
        {
            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().webhostMap(this);
            return this.chainGet(chainable, "/webhosts", params);
        },

        /**
         * Read a web host
         *
         * @chained web host
         *
         * @param {String} webhostId the web host id
         */
        readWebHost: function(webhostId)
        {
            var chainable = this.getFactory().webhost(this);
            return this.chainGet(chainable, "/webhosts/" + webhostId);
        },

        /**
         * Create a web host.
         *
         * @chained web host
         *
         * @param [Object] object JSON object
         */
        createWebHost: function(object)
        {
            var chainable = this.getFactory().webhost(this);
            return this.chainCreate(chainable, object, "/webhosts");
        },

        /**
         * Queries for web hosts.
         *
         * @chained web host map
         *
         * @param {Object} query Query for finding web hosts.
         * @param [Object] pagination pagination (optional)
         */
        queryWebHosts: function(query, pagination)
        {
            var chainable = this.getFactory().webhostMap(this);

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, "/webhosts/query", params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type web host.
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
        checkWebHostPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/webhosts/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type web host.
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
        checkWebHostAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/webhosts/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // CURRENT TENANT ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back a map of attachments for the platform's parent tenant.
         *
         * @chained attachment map
         *
         * @public
         */
        listTenantAttachments: function()
        {
            var self = this;

            // we bind the attachment map to a modified copy of platform with the URI adjusted
            // so that it forms "/tenant/attachments/<attachmentId>" for any lookups
            var pseudoTenant = this.clone();
            pseudoTenant.getUri = function () {
                return "/tenant";
            };

            var result = this.subchain(new Gitana.BinaryAttachmentMap(pseudoTenant));
            result.then(function() {

                var chain = this;

                self.getDriver().gitanaGet(self.getUri() + "/tenant/attachments", null, {}, function(response) {
                    chain.handleResponse(response);
                    chain.next();
                });

                return false;
            });

            return result;
        },

        /**
         * Picks off a single attachment from this platform's parent tenant
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        tenantAttachment: function(attachmentId)
        {
            return this.listTenantAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment to this platform's parent tenant.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        tenantAttach: function(attachmentId, contentType, data)
        {
            var self = this;

            var tenant = this.clone();
            tenant.getUri = function () {
                return "/tenant";
            };

            // the thing we're handing back
            var result = this.subchain(new Gitana.BinaryAttachment(tenant));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // upload the attachment
                var uploadUri = self.getUri() + "/tenant/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, null, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listTenantAttachments().then(function() {
                        this.select(attachmentId).then(function() {
                            result.handleResponse(this);
                        });
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment from this platform's parent tenant.
         *
         * @param attachmentId
         */
        tenantUnattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/tenant/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
        },

        /**
         * Generates a URI to a preview resource.
         */
        getTenantPreviewUri: Gitana.Methods.getPreviewUri("tenant/preview"),


        /**
         * Connects to a specific application on the platform.  Preloads any application data and stack information
         * and then fires into a callback with context set to application helper.
         *
         * @param settings
         * @param callback
         */
        app: function(settings, callback)
        {
            var self = this;

            // support for null appkey
            if (Gitana.isFunction(settings)) {
                callback = settings;
                settings = null;
            }

            if (Gitana.isString(settings)) {
                settings = { "application": settings };
            }

            // build preload config
            var config = {
                "application": null,
                "appCacheKey": null
            };
            Gitana.copyKeepers(config, Gitana.loadDefaultConfig());
            Gitana.copyKeepers(config, self.getDriver().getOriginalConfiguration());
            Gitana.copyKeepers(config, settings);

            // is this app context already cached?
            var cacheKey = config.appCacheKey;
            if (cacheKey)
            {
                if (Gitana.APPS && Gitana.APPS[cacheKey])
                {
                    return callback.call(Chain(Gitana.APPS[cacheKey]));
                }
            }

            if (!config.application) {
                callback.call(self, new Error("No application configured"));
                return;
            }

            // load and cache
            var helper = new Gitana.AppHelper(self, config);
            if (!Gitana.APPS) {
                Gitana.APPS = {};
            }

            helper.init.call(helper, function(err) {

                if (err)
                {
                    callback(err);
                    return;
                }

                if (cacheKey)
                {
                    Gitana.APPS[cacheKey] = helper;
                }

                callback.call(Chain(helper));
            });
        },



        /**
         * Retrieves authorities and permissions for multiple reference/principal combinations.
         *
         * Example of entries array:
         *
         * [{
         *    "permissioned": "<permissionedReference>",
         *    "principalId": "<principalId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissioned": "<permissionedReference>",
         *    "principalId": "<principalId>",
         *    "authorities": [...],
         *    "permissions": [...]
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        accessLookups: function(entries, callback)
        {
            var uriFunction = function()
            {
                return "/access/lookup";
            };

            var object = {
                "entries": entries
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["entries"]);
            });
        },

        /**
         * Retrieves authorities and permissions for multiple reference/principal combinations.
         *
         * Example of entries array:
         *
         * [{
         *    "permissioned": "<permissionedReference>",
         *    "principalId": "<principalId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissioned": "<permissionedReference>",
         *    "principalId": "<principalId>",
         *    "permissionId|authorityId": "<permissionId|authorityId>",
         *    "hasPermission|hasAuthority": true | false
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        accessChecks: function(entries, callback)
        {
            var uriFunction = function()
            {
                return "/access/check";
            };

            var object = {
                "entries": entries
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["entries"]);
            });
        },

        /**
         * Reads one or more referenceable objects by reference id.
         *
         * Example of entries array:
         *
         * [{
         *    "ref": "<reference>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "ref": "<reference>",
         *    "entry": { ... object }
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        referenceReads: function(entries, callback)
        {
            var uriFunction = function()
            {
                return "/ref/read";
            };

            var object = {
                "entries": entries
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["entries"]);
            });
        },

        /**
         * Calculates the JSON Patch diff between two objects.
         *
         * @param sourceRef
         * @param targetRef
         *
         * @param callback
         */
        referenceDiff: function(sourceRef, targetRef, callback)
        {
            var uriFunction = function()
            {
                return "/ref/diff";
            };

            var params = {
                "source": sourceRef,
                "target": targetRef
            };

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Applies a JSON Patch to an object to produce a patched object.
         *
         * @param sourceRef
         * @param diffObject
         *
         * @param callback
         */
        referenceMerge: function(sourceRef, diffObject, callback)
        {
            var uriFunction = function()
            {
                return "/ref/merge";
            };

            var params = {
                "source": sourceRef
            };

            return this.chainPostResponse(this, uriFunction, params, diffObject).then(function(response) {
                callback.call(this, response);
            });
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ADMIN
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        adminIndexDatastores: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/index";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        adminRepair: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/repair";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // RULE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the available rule actions.
         *
         * @param pagination
         *
         * @chained action descriptor map
         */
        listRuleActions: function(pagination, callback)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/rule/actions";
            };

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },

        /**
         * Reads a rule action.
         *
         * @param actioqnId
         *
         * @chained a
         */
        readRuleAction: function(actionId, callback)
        {
            var uriFunction = function()
            {
                return "/rule/actions/" + actionId;
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },

        /**
         * Lists the available rule conditions.
         *
         * @param pagination
         *
         * @chained condition descriptor map
         */
        listRuleConditions: function(pagination, callback)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/rule/conditions";
            };

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },

        /**
         * Reads a rule condition.
         *
         * @param conditionId
         *
         * @chained a
         */
        readRuleCondition: function(conditionId, callback)
        {
            var uriFunction = function()
            {
                return "/rule/conditions/" + conditionId;
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW MODELS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployed workflow models.
         *
         * @param pagination
         *
         * @chained workflow model map
         */
        listWorkflowModels: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainGet(chainable, "/workflow/models", params);
        },

        /**
         * Lists all workflow models.
         *
         * @param pagination
         *
         * @chained workflow model map
         */
        listAllWorkflowModels: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainGet(chainable, "/workflow/models?all=true", params);
        },

        /**
         * Reads a workflow model.
         *
         * @param {String} workflowModelId
         * @param [String] workflowModelVersionId
         *
         * @chained workflowModel
         */
        readWorkflowModel: function(workflowModelId, workflowModelVersionId)
        {
            var uriFunction = function()
            {
                var url = "/workflow/models/" + workflowModelId;
                if (workflowModelVersionId)
                {
                    url += "/versions/" + workflowModelVersionId;
                }

                return url;
            };

            var chainable = this.getFactory().workflowModel(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Create a workflow model
         *
         * @chained workflow model
         *
         * @param {String} id
         * @param [Object] object JSON object
         */
        createWorkflowModel: function(id, object)
        {
            if (!object)
            {
                object = {};
            }

            object.id = id;

            var chainable = this.getFactory().workflowModel(this);
            return this.chainCreate(chainable, object, "/workflow/models");
        },

        /**
         * Queries for deployed workflow models.
         *
         * @chained workflow model map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryWorkflowModels: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/workflow/models/query";
            };

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Queries for all (deployed and not deployed) workflow models.
         *
         * @chained workflow model map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryAllWorkflowModels: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/workflow/models/query?all=true";
            };

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type workflow model.
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
        checkWorkflowModelPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/models/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type workflow model.
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
        checkWorkflowModelAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/models/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Lists the workflow model versions.
         *
         * @param id
         * @param pagination
         *
         * @chained workflow model map
         */
        listWorkflowModelVersions: function(id, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var self = this;

                return "/workflow/models/" + id + "/versions";
            };

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for workflow model versions.
         *
         * @chained workflow model map
         *
         * @param {String} id
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryWorkflowModelVersions: function(id, query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var self = this;

                return "/workflow/models/" + id + "/versions/query";
            };

            var chainable = this.getFactory().workflowModelMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW INSTANCES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the workflows.
         *
         * @param pagination
         *
         * @chained client map
         */
        listWorkflows: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowInstanceMap(this);
            return this.chainGet(chainable, "/workflow/instances", params);
        },

        /**
         * Reads a workflow.
         *
         * @param workflowId
         *
         * @chained workflow
         */
        readWorkflow: function(workflowId)
        {
            var chainable = this.getFactory().workflowInstance(this);
            return this.chainGet(chainable, "/workflow/instances/" + workflowId);
        },

        /**
         * Create a workflow
         *
         * @chained workflow
         *
         * @param {String} workflowModelId workflow id
         * @param [Object] object JSON object
         */
        createWorkflow: function(workflowModelId, object)
        {
            if (!object)
            {
                object = {};
            }

            var params = {
                "modelId": workflowModelId
            };

            var chainable = this.getFactory().workflowInstance(this);
            return this.chainCreate(chainable, object, "/workflow/instances", params);
        },

        /**
         * Queries for workflows.
         *
         * @chained workflow map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryWorkflows: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/workflow/instances/query";
            };

            var chainable = this.getFactory().workflowInstanceMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type workflow instance.
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
        checkWorkflowInstancePermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/instance/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type workflow instance.
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
        checkWorkflowInstanceAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/instance/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW TASKS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the workflow tasks.
         *
         * @param pagination
         *
         * @chained workflow task map
         */
        listWorkflowTasks: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowTaskMap(this);
            return this.chainGet(chainable, "/workflow/tasks", params);
        },

        /**
         * Reads a workflow task.
         *
         * @param workflowTaskId
         *
         * @chained workflow task
         */
        readWorkflowTask: function(workflowTaskId)
        {
            var chainable = this.getFactory().workflowTask(this);
            return this.chainGet(chainable, "/workflow/tasks/" + workflowTaskId);
        },

        /**
         * Queries for workflow tasks.
         *
         * @chained workflow task map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryWorkflowTasks: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/workflow/tasks/query";
            };

            var chainable = this.getFactory().workflowTaskMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type workflow task.
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
        checkWorkflowTaskPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/task/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type workflow task.
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
        checkWorkflowTaskAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/task/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW COMMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the workflow comments.
         *
         * @param pagination
         *
         * @chained workflow comment map
         */
        listWorkflowComments: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowCommentMap(this);
            return this.chainGet(chainable, "/workflow/comments", params);
        },

        /**
         * Reads a workflow comment.
         *
         * @param workflowCommentId
         *
         * @chained workflow comment
         */
        readWorkflowComment: function(workflowCommentId)
        {
            var chainable = this.getFactory().workflowComment(this);
            return this.chainGet(chainable, "/workflow/comments/" + workflowCommentId);
        },

        /**
         * Create a workflow comment
         *
         * @chained workflow comment
         *
         * @param {String} workflowId
         * @param [String] workflowTaskId
         * @param [Object] object JSON object
         */
        createWorkflowComment: function(workflowId, workflowTaskId, object)
        {
            var params = {};

            var createUri = function()
            {
                var uri = "/workflow/instances/" + workflowId + "/comments";
                if (workflowTaskId)
                {
                    uri += "?taskId=" + workflowTaskId;
                }

                return uri;
            };

            var readUri = function(status)
            {
                return "/workflow/comments/" + status._doc;
            };

            var chainable = this.getFactory().workflowComment(this);

            return this.chainCreateEx(chainable, object, createUri, readUri);
        },

        /**
         * Queries for workflow comments.
         *
         * @chained workflow comment map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryWorkflowComments: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/workflow/comments/query";
            };

            var chainable = this.getFactory().workflowCommentMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type workflow task.
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
        checkWorkflowCommentPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/comments/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type workflow task.
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
        checkWorkflowCommentAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/comments/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW TASKS - CURRENT USER
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists tasks for the current user.
         *
         * @param filter empty or "assigned" or "unassigned"
         * @param pagination
         *
         * @returns {*}
         */
        listTasksForCurrentUser: function(filter, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (filter)
            {
                params.filter = filter;
            }

            var chainable = this.getFactory().workflowTaskMap(this);
            return this.chainGet(chainable, "/workflow/user/tasks", params);
        },

        /**
         * Lists tasks for the current user.
         *
         * @param filter empty or "assigned" or "unassigned"
         * @param query
         * @param pagination
         *
         * @returns {*}
         */
        queryTasksForCurrentUser: function(filter, query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (filter)
            {
                params.filter = filter;
            }

            var chainable = this.getFactory().workflowTaskMap(this);
            return this.chainPost(chainable, "/workflow/user/tasks/query", params, query);
        },

        queryTasks: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().workflowTaskMap(this);
            return this.chainPost(chainable, "/workflow/tasks/query", params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // WORKFLOW HISTORY
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Loads the history for a workflow.
         *
         * @param workflowId the id of the workflow to load the history for
         * @param workflowTaskId the current workflow task (or null if full history)
         * @param pagination
         * @param callback
         */
        loadWorkflowHistory: function(workflowId, pagination, callback)
        {
            var uriFunction = function()
            {
                return "/workflow/instances/" + workflowId + "/history";
            };

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // SCHEDULED WORK ITEMS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the scheduled work items.
         *
         * @param pagination
         *
         * @chained scheduled work item map
         */
        listScheduledWorkItems: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().scheduledWorkMap(this);
            return this.chainGet(chainable, "/work/scheduled", params);
        },

        /**
         * Reads a scheduled work item.
         *
         * @param scheduledWorkId
         *
         * @chained scheduled work
         */
        readScheduledWorkItem: function(scheduledWorkId)
        {
            var chainable = this.getFactory().scheduledWork(this);
            return this.chainGet(chainable, "/work/scheduled/" + scheduledWorkId);
        },

        /**
         * Create a scheduled work item
         *
         * @chained scheduled work
         *
         * @param [Object] object JSON object
         */
        createScheduledWorkItem: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().scheduledWork(this);
            return this.chainCreate(chainable, object, "/work/scheduled");
        },

        /**
         * Queries for scheduled work items.
         *
         * @chained scheduled work item map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryScheduledWorkItems: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/work/scheduled/query";
            };

            var chainable = this.getFactory().scheduledWorkMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type scheduled work.
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
        checkScheduledWorkPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/work/scheduled/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type scheduled work.
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
        checkScheduledWorkAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/work/scheduled/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },





        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // REPORTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the reports.
         *
         * @param pagination
         *
         * @chained scheduled work item map
         */
        listReports: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().reportMap(this);
            return this.chainGet(chainable, "/reports", params);
        },

        /**
         * Reads a report.
         *
         * @param reportId
         *
         * @chained report
         */
        readReport: function(reportId)
        {
            var chainable = this.getFactory().report(this);
            return this.chainGet(chainable, "/reports/" + reportId);
        },

        /**
         * Create a report
         *
         * @chained report
         *
         * @param [Object] object JSON object
         */
        createReport: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().report(this);
            return this.chainCreate(chainable, object, "/reports");
        },

        /**
         * Queries for reports.
         *
         * @chained report map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryReports: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/reports/query";
            };

            var chainable = this.getFactory().reportMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type report.
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
        checkReportPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/reports/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type report.
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
        checkReportAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/reports/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Executes a report.
         *
         * @chained report
         *
         * @param {String} reportId the id of the report to run
         * @param [Object] config additional config
         * @param [Object] pagination
         * @param {Function} callback callback to fire
         */
        executeReport: function(reportId, config, pagination, callback)
        {
            if (typeof(config) === "function")
            {
                callback = config;
                config = {};
                pagination = null;
            }

            if (typeof(pagination) === "function")
            {
                callback = pagination;
                pagination = null;

                if (!config) {
                    config = {};
                }
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/reports/" + reportId + "/execute";
            };

            return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {
                callback.call(this, response);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // EXPORTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Runs an export and waits for the export to complete.
         *
         * This runs an asynchronous background poll checking status for the job to complete.
         * Once complete, the exportId and status are passed to the callback.
         *
         * @param objects
         * @param configuration
         * @param callback
         * @returns {*}
         */
        runExport: function(objects, configuration, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return "/ref/exports/start";
            };

            if (!configuration)
            {
                configuration = {};
            }

            var references = [];
            if (objects.refs)
            {
                references = objects.refs();
            }
            else if (objects.length)
            {
                for (var i = 0; i < objects.length; i++)
                {
                    references.push(objects[i].ref());
                }
            }
            configuration.references = references;

            var chainable = this;

            return this.chainPostResponse(this, uriFunction, {}, configuration).then(function(response) {

                var exportId = response._doc;

                // wait for the export to finish...
                var f = function()
                {
                    window.setTimeout(function() {

                        Chain(chainable).readExportStatus(exportId, function(status) {
                            if (status.state == "FINISHED") {
                                callback(exportId, status);
                                chainable.next();
                            } else if (status.state == "ERROR") {
                                callback(exportId, status);
                                chainable.next();
                            } else {
                                f();
                            }
                        });

                    }, 1000);
                };
                f();

                return false;

            });
        },

        /**
         * Retrieves the status for a running export job.
         * The status includes the "fileCount" field which indicates the total number of exported files.
         *
         * @param exportId
         * @param callback
         * @returns {*}
         */
        readExportStatus: function(exportId, callback)
        {
            var uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/status";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Gets the download URL for a completed export.
         *
         * @param exportId
         * @param index
         * @param useDispositionHeader
         * @returns {string}
         */
        exportDownloadUrl: function(exportId, index, useDispositionHeader)
        {
            var url = "/ref/exports/" + exportId + "/download";

            if (index)
            {
                url += "/" + index;
            }

            if (useDispositionHeader)
            {
                url += "?a=true";
            }

            return url;
        },







        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // EXTERNAL SERVICE DESCRIPTORS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the service descriptors.
         *
         * @param pagination
         *
         * @chained descriptor map
         */
        listServiceDescriptors: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().descriptorMap(this);
            return this.chainGet(chainable, "/descriptors", params);
        },

        /**
         * Reads a service descriptor.
         *
         * @param descriptorId
         *
         * @chained descriptor
         */
        readServiceDescriptor: function(descriptorId)
        {
            var chainable = this.getFactory().descriptor(this);
            return this.chainGet(chainable, "/descriptors/" + descriptorId);
        },

        /**
         * Create a service descriptor
         *
         * @chained descriptor
         *
         * @param [Object] object JSON object
         */
        createServiceDescriptor: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().descriptor(this);
            return this.chainCreate(chainable, object, "/descriptors");
        },

        /**
         * Queries for descriptors.
         *
         * @chained descriptor map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryServiceDescriptors: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/descriptors/query";
            };

            var chainable = this.getFactory().descriptorMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type external service descriptor.
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
        checkServiceDescriptorPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/descriptors/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type external service descriptor.
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
        checkServiceDescriptorAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/descriptors/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // UI CONFIGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the UI config instances.
         *
         * @param pagination
         *
         * @chained ui config map
         */
        listUIConfigs: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().uiConfigMap(this);
            return this.chainGet(chainable, "/uiconfigs", params);
        },

        /**
         * Reads a UI config instance.
         *
         * @param uiConfigId
         *
         * @chained uiConfig
         */
        readUIConfig: function(uiConfigId)
        {
            var chainable = this.getFactory().uiConfig(this);
            return this.chainGet(chainable, "/uiconfigs/" + uiConfigId);
        },

        /**
         * Create a UI config instance
         *
         * @chained uiConfig
         *
         * @param [Object] object JSON object
         */
        createUIConfig: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().uiConfig(this);
            return this.chainCreate(chainable, object, "/uiconfigs");
        },

        /**
         * Queries for UI configs.
         *
         * @chained UI config map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryUIConfigs: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/uiconfigs/query";
            };

            var chainable = this.getFactory().uiConfigMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type uiconfig.
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
        checkUIConfigPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/uiconfigs/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type uiconfig.
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
        checkUIConfigAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/uiconfigs/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT RECEIVERS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployment receivers.
         *
         * @param pagination
         *
         * @chained deployment receiver map
         */
        listDeploymentReceivers: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().deploymentReceiverMap(this);
            return this.chainGet(chainable, "/deployment/receivers", params);
        },

        /**
         * Reads a deployment receiver.
         *
         * @param deploymentReceiverId
         *
         * @chained deploymentReceiver
         */
        readDeploymentReceiver: function(deploymentReceiverId)
        {
            var chainable = this.getFactory().deploymentReceiver(this);
            return this.chainGet(chainable, "/deployment/receivers/" + deploymentReceiverId);
        },

        /**
         * Create a deployment receiver
         *
         * @chained deployment receiver
         *
         * @param [Object] object JSON object
         */
        createDeploymentReceiver: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().deploymentReceiver(this);
            return this.chainCreate(chainable, object, "/deployment/receivers");
        },

        /**
         * Queries for deployment receivers.
         *
         * @chained deployment receiver map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryDeploymentReceivers: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/deployment/receivers/query";
            };

            var chainable = this.getFactory().deploymentReceiverMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type deployment receiver.
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
        checkDeploymentReceiverPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/receivers/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type deployment receiver.
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
        checkDeploymentReceiverAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/receivers/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT PACKAGES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployment packages.
         *
         * @param pagination
         *
         * @chained deployment package map
         */
        listDeploymentPackages: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().deploymentPackageMap(this);
            return this.chainGet(chainable, "/deployment/packages", params);
        },

        /**
         * Reads a deployment package
         *
         * @param deploymentPackageId
         *
         * @chained deployment package
         */
        readDeploymentPackage: function(deploymentPackageId)
        {
            var chainable = this.getFactory().deploymentPackage(this);
            return this.chainGet(chainable, "/deployment/packages/" + deploymentPackageId);
        },

        /**
         * Queries for deployment packages
         *
         * @chained deployment package map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryDeploymentPackages: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/deployment/packages/query";
            };

            var chainable = this.getFactory().deploymentPackageMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type deployment package.
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
        checkDeploymentPackagePermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/packages/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type deployment package.
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
        checkDeploymentPackageAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/packages/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT STRATEGY
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployment strategies.
         *
         * @param pagination
         *
         * @chained deployment strategy map
         */
        listDeploymentStrategies: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().deploymentStrategyMap(this);
            return this.chainGet(chainable, "/deployment/strategies", params);
        },

        /**
         * Reads a deployment strategy.
         *
         * @param deploymentStrategyId
         *
         * @chained deployment strategy
         */
        readDeploymentStrategy: function(deploymentStrategyId)
        {
            var chainable = this.getFactory().deploymentStrategy(this);
            return this.chainGet(chainable, "/deployment/strategies/" + deploymentStrategyId);
        },

        /**
         * Create a deployment strategy.
         *
         * @chained deployment strategy
         *
         * @param [Object] object JSON object
         */
        createDeploymentStrategy: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().deploymentStrategy(this);
            return this.chainCreate(chainable, object, "/deployment/strategies");
        },

        /**
         * Queries for deployment strategies
         *
         * @chained deployment strategy map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryDeploymentStrategies: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/deployment/strategies/query";
            };

            var chainable = this.getFactory().deploymentStrategyMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type deployment strategy.
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
        checkDeploymentStrategyPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/strategies/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type deployment strategy.
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
        checkDeploymentStrategyAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/strategies/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // DEPLOYMENT TARGET
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the deployment targets.
         *
         * @param pagination
         *
         * @chained deployment target map
         */
        listDeploymentTargets: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().deploymentTargetMap(this);
            return this.chainGet(chainable, "/deployment/targets", params);
        },

        /**
         * Reads a deployment target.
         *
         * @param deploymentTargetId
         *
         * @chained deployment target
         */
        readDeploymentTarget: function(deploymentTargetId)
        {
            var chainable = this.getFactory().deploymentTarget(this);
            return this.chainGet(chainable, "/deployment/targets/" + deploymentTargetId);
        },

        /**
         * Create a deployment target.
         *
         * @chained deployment target
         *
         * @param [Object] object JSON object
         */
        createDeploymentTarget: function(object)
        {
            if (!object)
            {
                object = {};
            }

            var chainable = this.getFactory().deploymentTarget(this);
            return this.chainCreate(chainable, object, "/deployment/targets");
        },

        /**
         * Queries for deployment targets
         *
         * @chained deployment target map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryDeploymentTargets: function(query, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/deployment/targets/query";
            };

            var chainable = this.getFactory().deploymentTargetMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type deployment target.
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
        checkDeploymentTargetPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/targets/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type deployment target.
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
        checkDeploymentTargetAuthorities: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/deployment/targets/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }

    });

})(window);
