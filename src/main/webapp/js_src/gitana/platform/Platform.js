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
            this.objectType = "Gitana.Platform";

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
            return "platform";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().platform(this.getCluster(), this.object);
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

            return this.chainReload(this.clone(), uriFunction);
        },

        /** @Override **/
        update: function()
        {
            // not implemented
            return this;
        },

        /**
         * Hands back the domain id of the platform's default domain which is the default location for storage
         * of sub-principals and teams principals.
         */
        getDefaultDomainId: function()
        {
            return this.get("defaultDomainId");
        },

        /**
         * Hands back the default domain instance for this platform.
         *
         * @chained domain
         */
        readDefaultDomain: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/domains/" + self.getDefaultDomainId();
            };

            var chainable = this.getFactory().domain(this);
            return this.chainGet(chainable, uriFunction);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
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
         * @chained job
         *
         * @param {String} jobId
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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
            var chainable = this.getFactory().application(this);
            return this.chainGet(chainable, "/applications/" + applicationId);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
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
        checkClientPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/clients/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // AUTHENTICATION GRANTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the authentication grants.
         *
         * @param pagination
         *
         * @chained authentication grant map
         */
        listAuthenticationGrants: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().authenticationGrantMap(this);
            return this.chainGet(chainable, "/auth/grants", params);
        },

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
        checkAuthenticationGrantPermissions: function(checks, callback)
        {
            var uriFunction = function()
            {
                return "/auth/grants/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
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

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
        },

    });

})(window);
