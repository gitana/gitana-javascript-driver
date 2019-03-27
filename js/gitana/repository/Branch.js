(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Branch = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.Branch.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class Branch
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository, object);

            this.objectType = function() { return "Gitana.Branch"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_BRANCH;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().branch(this.getRepository(), this);
        },

        /**
         * @returns {Boolean} whether this is the master branch
         */
        isMaster: function()
        {
            return (this.getBranchType().toLowerCase() == "master");
        },

        /**
         * @return {String} the type of branch ("master" or "custom")
         */
        getBranchType: function()
        {
            return this.get("type");
        },

        /**
         * @return {String} the tip changeset of the branch
         */
        getTip: function()
        {
            return this.get("tip");
        },

        /**
         * Acquires a list of mount nodes under the root of the repository.
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listMounts: function(pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/nodes";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads a node.
         *
         * @chained node
         *
         * @public
         *
         * @param {String} nodeId the node id
         * @param [String] offset path
         * @param [String] params
         */
        readNode: function(nodeId, path, params)
        {
            var self = this;
            
            var uriFunction = function()
            {
                return self.getUri() + "/nodes/" + nodeId;
            };

            params = params || {};

            if (path) {
                params.path = path;
            }

            var chainable = this.getFactory().node(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Reads the root node.
         *
         * @chained node
         *
         * @public
         */
        rootNode: function()
        {
            return this.readNode("root");
        },

        /**
         * Create a node
         *
         * @chained node
         *
         * @public
         *
         * @param [Object] object JSON object
         * @param [Object|String] options a JSON object providing the configuration for the create operation.
         *                                If a string, must follow format (<rootNode>/<filePath>)
         */
        createNode: function(object, options)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/nodes";
            };

            var params = {};

            if (options)
            {
                var rootNodeId = "root"; // default
                var associationType = "a:child"; // default
                var filePath = null;
                var parentFolderPath = null;
                var fileName = null;

                // if they pass in a string instead of an options object, then the string can follow the format
                // (/root/pages/file.txt) where root is the root node to start from
                if (typeof(options) === "string")
                {
                    var rootPrefixedFilePath = options;

                    // filePath should not start with "/"
                    if (Gitana.startsWith(rootPrefixedFilePath, "/")) {
                        rootPrefixedFilePath = rootPrefixedFilePath.substring(1);
                    }

                    if (rootPrefixedFilePath == "") {
                        filePath = "/";
                    } else {
                        var i = rootPrefixedFilePath.indexOf("/");
                        rootNodeId = rootPrefixedFilePath.substring(0, i);
                        filePath = rootPrefixedFilePath.substring(i + 1);
                    }
                }
                else if (typeof(options) === "object")
                {
                    if (options.rootNodeId) {
                        rootNodeId = options.rootNodeId;
                    }
                    if (options.associationType) {
                        associationType = options.associationType;
                    }
                    if (options.fileName) {
                        fileName = options.fileName;
                    }
                    else if (options.filename) {
                        fileName = options.filename;
                    }
                    if (options.parentFolderPath) {
                        parentFolderPath = options.parentFolderPath;
                    }
                    else if (options.folderPath) {
                        parentFolderPath = options.folderPath;
                    }
                    else if (options.folderpath) {
                        parentFolderPath = options.folderpath;
                    }
                    if (options.filePath) {
                        filePath = options.filePath;
                    }
                    else if (options.filepath) {
                        filePath = options.filepath;
                    }
                }

                // plug in the resolved params
                if (rootNodeId) {
                    params.rootNodeId = rootNodeId;
                }
                if (associationType) {
                    params.associationType = associationType;
                }
                if (fileName) {
                    params.fileName = fileName;
                }
                if (filePath) {
                    params.filePath = filePath;
                }
                if (parentFolderPath) {
                    params.parentFolderPath = parentFolderPath;
                }

                // allow custom params to be passed through
                if (options.params) {
                    for (var param in options.params) {
                        params[param] = options.params[param];
                    }
                }
            }

            var chainable = this.getFactory().node(this);
            return this.chainCreate(chainable, object, uriFunction, params);
        },

        /**
         * Searches the branch.
         *
         * @chained node map
         *
         * Config should be:
         *
         *    {
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * For a full text term search, you can simply provide text in place of a config json object.
         *
         * See the Elastic Search documentation for more advanced examples
         *
         * @public
         *
         * @param search
         * @param [Object] pagination
         */
        searchNodes: function(search, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (Gitana.isString(search))
            {
                search = {
                    "search": search
                };
            }

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/search";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, search);
        },

        /**
         * Queries for nodes on the branch.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryNodes: function(query, pagination)
        {
            var self = this;

            if (!query) {
                query = {};
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/query";
            };

            var chainable = this.getFactory().nodeMap(this);

            if (!Gitana.PREFER_GET_OVER_POST)
            {
                return this.chainPost(chainable, uriFunction, params, query);
            }
            else
            {
                Gitana.copyInto(params, {
                    "query": JSON.stringify(query)
                });

                return this.chainGet(chainable, uriFunction, params);
            }


        },

        /**
         * Queries for a single matching node to a query on the branch.
         *
         * @chained node
         *
         * @param query
         * @param errHandler
         *
         * @returns Gitana.Node
         */
        queryOne: function(query, errHandler)
        {
            return this.queryNodes(query).keepOne(function(err) {
                if (errHandler)
                {
                    errHandler(err);
                    return false;
                }
            });
        },

        /**
         * Process a GraphQL query to the branch.
         *
         * @param query
         * @param operationName
         * @param variables
         * @param callback function(result)
         *
         * @returns result
         */
        graphqlQuery: function(query, operationName, variables, callback)
        {
            var self = this;

            var params = {
                query: query
            };

            if (variables)
            {
                params.variables = variables;
            }

            if (operationName)
            {
                params.operationName = operationName;
            }

            var uriFunction = function()
            {
                return self.getUri() + "/graphql";
            };

            if (!Gitana.PREFER_GET_OVER_POST)
            {
                return self.chainPostResponse(self, uriFunction, {}, params).then(function(response) {
                    callback(response);
                });
            }
            else
            {
                return self.chainGetResponse(self, uriFunction, params).then(function(response) {
                    callback(response);
                });
            }
        },

        /**
         * Fetch the GraphQL schema for the branch.
         *
         * @param callback function(schema)
         * 
         * @returns String
         */
        graphqlSchema: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/graphql/schema";
            };
            
            return self.chainGetResponseText(self, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },

        /**
         * Deletes the nodes described the given array of node ids.
         *
         * @hcained branch
         *
         * @param nodeIds
         *
         * @returns Gitana.Branch
         */
        deleteNodes: function(nodeIds)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/delete";
            };

            return this.chainPost(this, uriFunction, {}, {
                "_docs": nodeIds
            });
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type node.
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
        checkNodePermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type node.
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
        checkNodeAuthorities: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/authorities/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },


        /**
         * Reads the person object for a security user.
         *
         * @chained node
         *
         * @param {Object} user either the user id, user name or the user object
         * @param [Boolean] createIfNotFound whether to create the person object if it isn't found
         */
        readPersonNode: function(user, createIfNotFound)
        {
            var self = this;

            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(user);

            var uriFunction = function()
            {
                var uri = self.getUri() + "/person/acquire?id=" + principalDomainQualifiedId;
                if (createIfNotFound)
                {
                    uri += "&createIfNotFound=" + createIfNotFound;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this, "n:person");
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads the group object for a security group.
         *
         * @chained node
         *
         * @param {Object} group eitehr the group id, group name or the group object
         * @param [Boolean] createIfNotFound whether to create the group object if it isn't found
         */
        readGroupNode: function(group, createIfNotFound)
        {
            var self = this;

            var principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(group);

            var uriFunction = function()
            {
                var uri = self.getUri() + "/group/acquire?id=" + principalDomainQualifiedId;
                if (createIfNotFound)
                {
                    uri += "&createIfNotFound=" + createIfNotFound;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this, "n:group");
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Acquire a list of definitions.
         *
         * @chained node map
         *
         * @public
         *
         * @param [String] filter Optional filter of the kind of definition to fetch - "association", "type" or "feature"
         * @param [Object] pagination Optional pagination
         */
        listDefinitions: function(filter, pagination)
        {
            if (filter && typeof(filter) === "object")
            {
                pagination = filter;
                filter = null;
            }

            var self = this;

            var params = {};
            params["capabilities"] = "true";
            if (filter)
            {
                params["filter"] = filter;
            }
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/definitions";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Query and search a list of definitions
         * 
         * @param {*} json contains a search object and a query object
         * @param {*} pagination 
         */
        queryDefinitions: function(json, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/definitions/query";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, json);
        },

        /**
         * Reads a definition by qname.
         *
         * @chained definition
         *
         * @public
         *
         * @param {String} qname the qname
         */
        readDefinition: function(qname)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/definitions/" + qname;
            };

            var chainable = this.getFactory().definition(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Loads a list of schemas for an optional given type.
         *
         * @chained this
         *
         * @public
         *
         * @param [String] filter Optional filter of the kind of definition to fetch - "association", "type" or "feature"
         * @param {Function} callback
         */
        loadSchemas: function(filter, callback)
        {
            if (typeof(filter) == "function")
            {
                callback = filter;
                filter = null;
            }

            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/schemas";
                if (filter) {
                    uri += "?filter=" + filter;
                }
                self.getDriver().gitanaGet(uri, null, {}, function(response) {

                    callback.call(chain, response);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },


        /**
         * Reads a schema by qname.
         *
         * @chained this
         *
         * @public
         *
         * @param {String} qname the qname
         */
        loadSchema: function(qname, callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/schemas/" + qname;
                self.getDriver().gitanaGet(uri, null, {}, function(response) {
                    callback.call(chain, response);
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        /**
         * Determines an available QName on this branch given some input.
         * This makes a call to the repository and asks it to provide a valid QName.
         *
         * The valid QName is passed as an argument to the next method in the chain.
         *
         * Note: This QName is a recommended QName that is valid at the time of the call.
         *
         * If another thread writes a node with the same QName after this call but ahead of this thread
         * attempting to commit, an invalid qname exception may still be thrown back.
         *
         * @chained this
         *
         * @public
         *
         * @param {Object} object an object with "title" or "description" fields to base generation upon
         */
        generateQName: function(object, callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/qnames/generate";
                self.getDriver().gitanaPost(uri, null, object, function(response) {

                    var qname = response["_qname"];

                    callback.call(chain, qname);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        /**
         * Creates an association between the source node and the target node of the given type.
         *
         * @chained branch (this)
         *
         * @param sourceNode
         * @param targetNode
         * @param object (or string identifying type)
         */
        associate: function(sourceNode, targetNode, object)
        {
            // source
            var sourceNodeId = null;
            if (Gitana.isString(sourceNode))
            {
                sourceNodeId = sourceNode;
            }
            else
            {
                sourceNodeId = sourceNode.getId();
            }

            // target
            var targetNodeId = null;
            if (Gitana.isString(targetNode))
            {
                targetNodeId = targetNode;
            }
            else
            {
                targetNodeId = targetNode.getId();
            }

            // make sure we hand back the branch
            var result = this.subchain(this);

            // run a subchain to do the association
            result.subchain(this).then(function() {
                this.readNode(sourceNodeId).associate(targetNodeId, object);
            });

            return result;
        },

        /**
         * Traverses around the given node.
         *
         * Note: This is a helper function provided for convenience that delegates off to the node to do the work.
         *
         * @chained traversal results
         *
         * @param node or node id
         * @param config
         */
        traverse: function(node, config)
        {
            var nodeId = null;
            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            return this.readNode(nodeId).traverse(config);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CONTAINER (a:child) CONVENIENCE FUNCTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Creates a container node.
         *
         * This is a convenience function that simply applies the container feature to the object
         * ahead of calling createNode.
         *
         * @chained node
         *
         * @public
         *
         * @param [Object] object JSON object
         */
        createContainer: function(object)
        {
            if (!object)
            {
                object = {};
            }

            if (!object["_features"])
            {
                object["_features"] = {};
            }

            object["_features"]["f:container"] = {
                "active": "true"
            };

            return this.createNode(object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // FIND
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Finds nodes within a branch
         *
         * @chained node map
         *
         * Config should be:
         *
         *    {
         *       "query": {
         *           ... Query Block
         *       },
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * Alternatively, the value for "search" in the JSON block above can simply be text.
         *
         * @public
         *
         * @param {Object} config search configuration
         */
        find: function(config, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/nodes/find";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, config);
        },

        /**
         * Another way to access the find() method that is more consistent with the API
         * that would be expected.
         *
         * @param config
         * @param pagination
         * @return {*}
         */
        findNodes: function(config, pagination)
        {
            return this.find(config, pagination);
        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // NODE LIST
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * List the items in a node list.
         *
         * @chained node map
         *
         * @public
         *
         * @param {String} listKey
         * @param [Object] pagination
         */
        listItems: function(listKey, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/lists/" + listKey + "/items";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction, pagination);
        },

        /**
         * Queries for items in a node list.
         *
         * @chained node map
         *
         * @public
         *
         * @param {String} listKey
         * @param {Object} query
         * @param [Object] pagination
         */
        queryItems: function(listKey, query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/lists/" + listKey + "/items/query";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // UTILITIES
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Loads all of the definitions, forms and key mappings on this branch.
         *
         * @param filter
         * @param callback
         */
        loadForms: function(filter, callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/forms";
                if (filter) {
                    uri += "?filter=" + filter;
                }
                self.getDriver().gitanaGet(uri, null, {}, function(response) {

                    callback.call(chain, response);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ADMIN
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        adminRebuildPathIndexes: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/paths/index";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        adminRebuildSearchIndexes: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/search/index";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        adminContentMaintenance: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/content";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        adminUpgradeSchema: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/upgradeschema";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },

        createForExport: function(exportId, config, callback)
        {
            var self = this;

            if (!config)
            {
                config = {};
            }

            if (!config.repositoryId)
            {
                config.repositoryId = self.getRepositoryId();
            }
            if (!config.branchId)
            {
                config.branchId = self.getId();
            }
            if (!config.properties)
            {
                config.properties = {};
            }
            if (!config.parentFolderPath)
            {
                config.parentFolderPath = {};
            }

            var uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/generate";
            };

            var params = {};

            return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {
                callback(response);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INFO
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Loads information about the branch.
         *
         * @param callback
         */
        loadInfo: function(callback)
        {
            var uriFunction = function()
            {
                return this.getUri() +  "/info";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INDEXES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        createCustomIndex: function(name, index)
        {
            var self = this;

            var payload = null;
            if (typeof(index) === "undefined")
            {
                payload = name;
            }
            else
            {
                payload = {
                    "name": name,
                    "index": index
                };
            }

            var uriFunction = function()
            {
                return self.getUri() + "/indexes";
            };

            return this.chainPost(this, uriFunction, {}, payload);
        },

        dropCustomIndex: function(name)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/indexes/" + name;
            };

            return this.chainDelete(this, uriFunction);
        },

        loadCustomIndexes: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/indexes";
            };

            return this.chainGetResponse(this, uriFunction, {}).then(function(response) {
                callback(response);
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // HISTORY
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Loads the historic changesets for a branch.
         *
         * The config is optional and can specify "root" and "tip" changeset ids.
         *
         * @param config
         * @param pagination (optional)
         * @param callback
         * @returns {*}
         */
        loadHistoryChangesets: function(config, pagination, callback)
        {
            var self = this;

            if (typeof(pagination) === "function") {
                callback = pagination;
                pagination = null;
            }

            if (typeof(config) === "function") {
                callback = config;
                config = {};
                pagination = null;
            }

            if (!config) {
                config = {};
            }

            var uriFunction = function()
            {
                return self.getUri() + "/history/changesets";
            };

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (config.root) {
                params.root = config.root;
            }
            if (config.tip) {
                params.tip = config.tip;
            }
            if (config.include_root) {
                params.include_root = config.include_root;
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },

        /**
         * Loads the history node differences for a branch.
         *
         * The config is optional and can specify "root" and "tip" changeset ids.
         *
         * @param config
         * @param pagination (optional)
         * @param callback
         * @returns {*}
         */
        loadHistoryNodeDiffs: function(config, pagination, callback)
        {
            var self = this;

            if (typeof(pagination) === "function") {
                callback = pagination;
                pagination = null;
            }

            if (typeof(config) === "function") {
                callback = config;
                config = {};
                pagination = null;
            }

            if (!config) {
                config = {};
            }

            var uriFunction = function()
            {
                return self.getUri() + "/history/nodediffs";
            };

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            if (config.root) {
                params.root = config.root;
            }
            if (config.tip) {
                params.tip = config.tip;
            }
            if (config.include_root) {
                params.include_root = config.include_root;
            }

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        },



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Reads a deletion.
         *
         * @chained deletion
         *
         * @public
         *
         * @param {String} nodeId the node id
         */
        readDeletion: function(nodeId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deletions/" + nodeId;
            };

            var params = {};

            var chainable = this.getFactory().deletion(this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for deletions on the branch.
         *
         * Config should be:
         *
         *    {
         *       Gitana query configs
         *    }
         *
         * @chained deletion map
         *
         * @public
         *
         * @param {Object} query
         * @param [Object] pagination
         */
        queryDeletions: function(query, pagination)
        {
            var self = this;

            if (!query) {
                query = {};
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/deletions/query";
            };

            var chainable = this.getFactory().deletionMap(this);

            if (!Gitana.PREFER_GET_OVER_POST)
            {
                return this.chainPost(chainable, uriFunction, params, query);
            }
            else
            {
                Gitana.copyInto(params, {
                    "query": JSON.stringify(query)
                });

                return this.chainGet(chainable, uriFunction, params);
            }
        },

        /**
         * Purges all deletions.
         *
         * @chained this
         */
        purgeAllDeletions: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/deletions/purgeall";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Archives the branch.
         *
         * @param callback
         * @returns {*}
         */
        archive: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/archive";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Unarchives the branch.
         *
         * @param callback
         * @returns {*}
         */
        unarchive: function(callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/unarchive";
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback(response);
            });
        },

        /**
         * Finds the changes that will be applied from a source branch to a target branch. Runs as a background Job
         *
         * Params allow for:
         *
         *    root          root changeset id
         *    tip           tip changeset id
         *    include_root  whether to include the root changeset
         *    view          "editorial" to filter only to include editorial nodes
         *
         * @public
         *
         * @param options (request param options, pagination)
         * @param callback
         */
        startChangesetHistory: function(options, callback)
        {
            if (typeof(options) === "function") {
                callback = options;
                options = null;
            }

            var params = {};

            if (Gitana.isObject(options)) {
                for (var k in options) {
                    params[k] = options[k];
                }
            }

            var uriFunction = function()
            {
                return this.getUri() + "/history/start";
            };

            return this.chainPostResponse(this, uriFunction, params).then(function(response) {

                var jobId = response._doc;

                callback(jobId);
            });
        }

    });

})(window);
