(function(window)
{
    const Gitana = window.Gitana;

    Gitana.Node = Gitana.AbstractNode.extend(
    /** @lends Gitana.Node.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNode
         *
         * @class Node
         *
         * @param {Gitana.Branch} branch
         * @param {Object} [object] json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = function() { return "Gitana.Node"; };
        },

        /**
         * @override
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_NODE;
        },

        /**
         * Acquires the "child nodes" of this node.  This is done by fetching all of the nodes that are outgoing-associated to this
         * node with a association of type "a:child".
         *
         * @chained node map
         *
         * @public
         *
         * @param {object} pagination
         */
        listChildren: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/children";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Acquires the relatives of this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} config
         * @param {Object} [pagination]
         */
        listRelatives: function(config, pagination)
        {
            let type = null;
            let direction = null;

            if (config)
            {
                type = config.type;
                if (config.direction)
                {
                    direction = config.direction.toUpperCase();
                }
            }

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/relatives";
                if (type)
                {
                    url = url + "?type=" + type;
                }
                if (direction)
                {
                    if (type)
                    {
                        url = url + "&direction=" + direction;
                    }
                    else
                    {
                        url = url + "?direction=" + direction;
                    }
                }
                return url;
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Queries for relatives of this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} query
         * @param {Object} config
         * @param {Object} [pagination]
         */
        queryRelatives: function(query, config, pagination)
        {
            let type = null;
            let direction = null;

            if (config)
            {
                type = config.type;
                if (config.direction)
                {
                    direction = config.direction.toUpperCase();
                }
            }

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/relatives/query";
                if (type)
                {
                    url = url + "?type=" + type;
                }
                if (direction)
                {
                    if (type)
                    {
                        url = url + "&direction=" + direction;
                    }
                    else
                    {
                        url = url + "?direction=" + direction;
                    }
                }
                return url;
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPost(chainable, uriFunction, params, query);
        },

        patch: function(patches)
        {
            const uriFunction = function()
            {
                return this.getUri();
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPatch(chainable, uriFunction, null, patches);
        },

        /**
         * Retrieves all of the association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} config
         * @param {Object} pagination
         */
        associations: function(config, pagination)
        {
            let type = null;
            let direction = null;

            if (config)
            {
                type = config.type;
                if (config.direction)
                {
                    direction = config.direction.toUpperCase();
                }
            }

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associations?a=1";
                if (type)
                {
                    url = url + "&type=" + type;
                }
                if (direction)
                {
                    url = url + "&direction=" + direction;
                }

                return url;
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves all of the incoming association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {String} [type] - the type of association
         * @param {Object} [pagination]
         */
        incomingAssociations: function(type, pagination)
        {
            const config = {
                "direction": "INCOMING"
            };
            if (type) {
                config.type = type;
            }

            return this.associations(config, pagination);
        },

        /**
         * Retrieves all of the outgoing association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {String} [type] the type of association
         * @param {Object} [pagination]
         */
        outgoingAssociations: function(type, pagination)
        {
            const config = {
                "direction": "OUTGOING"
            };
            if (type) {
                config.type = type;
            }

            return this.associations(config, pagination);

        },

        /**
         * Associates a target node to this node.
         *
         * @chained this
         *
         * @public
         *
         * @param {String|Gitana.Node} targetNodeId - the id of the target node or the target node itself
         * @param {Object|String} [object] either a JSON object or a string identifying the type of association
         * @param {Boolean} [undirected] whether the association is undirected (i.e. mutual)
         */
        associate: function(targetNodeId, object, undirected)
        {
            if (!Gitana.isString(targetNodeId))
            {
                targetNodeId = targetNodeId.getId();
            }

            if (object)
            {
                if (Gitana.isString(object))
                {
                    object = {
                        "_type": object
                    };
                }
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associate?node=" + targetNodeId;

                if (undirected)
                {
                    url += "&directionality=UNDIRECTED";
                }

                return url;
            };

            return this.chainPostEmpty(null, uriFunction, null, object);
        },

        /**
         * Creates an association from another node to this one.
         *
         * @chained node (this)
         *
         * @public
         *
         * @param {Node} sourceNode
         * @param {Object} object
         * @param {Boolean} [undirected]
         */
        associateOf: function(sourceNode, object, undirected)
        {
            const self = this;

            // what we're handing back (ourselves)
            const result = this.subchain(this);

            // our work
            result.subchain(sourceNode).then(function() {
                this.associate(self, object, undirected);
            });

            return result;
        },

        /**
         * Unassociates a target node from this node.
         *
         * @chained this
         *
         * @public
         *
         * @param {String|Gitana.Node} targetNodeId the id of the target node or the target node itself
         * @param {String} [type] A string identifying the type of association
         * @param {Boolean} [undirected] whether the association is undirected (i.e. mutual)
         */
        unassociate: function(targetNodeId, type, undirected)
        {
            if (!Gitana.isString(targetNodeId))
            {
                targetNodeId = targetNodeId.getId();
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unassociate?node=" + targetNodeId;

                if (type)
                {
                    url = url + "&type=" + type;
                }

                if (undirected)
                {
                    url += "&directionality=UNDIRECTED";
                }

                return url;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Traverses around the node and returns any nodes found to be connected on the graph.
         *
         * Example config:
         *
         * {
         *    "associations": {
         *       "a:child": "MUTUAL",
         *       "a:knows": "INCOMING",
         *       "a:related": "OUTGOING"
         *    },
         *    "depth": 1,
         *    "types": [ "custom:type1", "custom:type2" ]
         * }
         *
         * @chained traversal results
         *
         * @public
         *
         * @param {Object} config configuration for the traversal
         */
        traverse: function(config)
        {
            // build the payload
            const payload = {
                "traverse": config
            };

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/traverse";
            };

            const chainable = this.getFactory().traversalResults(this.getBranch());
            const params = {};
            return this.chainPost(chainable, uriFunction, params, payload);
        },

        /**
         * Mounts a node
         *
         * @chained this
         *
         * @public
         *
         * @param {String} mountKey the mount key
         */
        mount: function(mountKey)
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/mount/" + mountKey;
            };

            return this.chainPostEmpty(null, uriFunction, null, object);
        },

        /**
         * Unmounts a node
         *
         * @public
         */
        unmount: function()
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unmount";
            };

            return this.chainPostEmpty(null, uriFunction, null, object);
        },

        /**
         * Locks a node
         *
         * @chained this
         *
         * @public
         */
        lock: function()
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Unlocks a node
         *
         * @chained this
         *
         * @public
         */
        unlock: function()
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unlock";
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Checks whether the node is locked.
         * The result is passed into the next method in the chain.
         *
         * @chained this
         *
         * @public
         */
        checkLocked: function(callback)
        {
            // TODO: isn't this subchain() redundant?
            return this.subchain(this).then(function() {

                const chain = this;

                // call
                const uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
                this.getDriver().gitanaGet(uri, null, {}, function(response) {

                    callback.call(chain, response["locked"]);

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieve full ACL and pass into chaining method.
         *
         * @chained node
         */
        loadACL: function(callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/acl/list";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Retrieve list of authorities and pass into chaining method.
         *
         * @chained node
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         */
        listAuthorities: function(principal)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl?id=" + principalDomainQualifiedId;
            };

            return this.chainGetResponseRows(this, uriFunction);
        },

        /**
         * Checks whether the given principal has a granted authority for this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param {Function} callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/check?id=" + principalDomainQualifiedId;
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/grant?id=" + principalDomainQualifiedId;
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/revoke?id=" + principalDomainQualifiedId;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @chained this
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
         * @param {Array} principalIds
         * @param {Function} callback
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

            return this.chainPostResponse(this, "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities", {}, json).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Checks whether the given principal has a permission against this object.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained server
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} permissionId the id of the permission
         * @param {Function} callback
         */
        checkPermission: function(principal, permissionId, callback)
        {
            const principalDomainQualifiedId = this.extractPrincipalDomainQualifiedId(principal);

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/permissions/" + permissionId + "/check?id=" + principalDomainQualifiedId;
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

        /**
         * Creates a new translation.
         *
         * @chained translation node
         *
         * @param {String} edition the edition of the translation (can be any string)
         * @param {String} locale the locale string for the translation (i.e. "en_US")
         * @param {Object} [object] JSON object
         */
        createTranslation: function(edition, locale, object)
        {
            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?locale=" + locale;
                if (edition)
                {
                    url += "&edition=" + edition;
                }

                return url;
            };

            const chainable = this.getFactory().node(this.getBranch());
            return this.chainCreateEx(chainable, object, uriFunction, uriFunction);
        },

        /**
         * Lists all of the editions for this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param {function} callback
         */
        editions: function(callback)
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/editions";
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["editions"]);
            });
        },

        /**
         * Lists all of the locales for the given edition of this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param {String} edition the edition
         * @param {function} callback
         */
        locales: function(edition, callback)
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/locales?edition=" + edition;
            };

            return this.chainGetResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["locales"]);
            });
        },

        /**
         * Acquires all of the translations for a master node.
         *
         * @chained node map
         *
         * @public
         *
         * @param {String} edition
         * @param {Object} [pagination]
         */
        listTranslations: function(edition, pagination)
        {
            const params = {};
            if (edition)
            {
                params.edition = edition;
            }
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/translations";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },


        /**
         * Reads a translation node of the current master node into a given locale and optional edition.
         * If an edition isn't provided, the tip edition from the master node is assumed.
         *
         * @chained translation node
         *
         * @param {String} edition The edition of the translation to use.  If not provided, the tip edition is used from the master node.
         * @param {String} locale The locale to translate into.
         */
        readTranslation: function()
        {
            let edition;
            let locale;

            const args = Gitana.makeArray(arguments);

            if (args.length === 1)
            {
                locale = args.shift();
            }
            else if (args.length > 1)
            {
                edition = args.shift();
                locale = args.shift();
            }

            const uriFunction = function()
            {
                let uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?locale=" + locale;
                if (edition)
                {
                    uri += "&edition=" + edition;
                }

                return uri;
            };

            const chainable = this.getFactory().node(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // CONTAINER CONVENIENCE FUNCTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create a node as a child of this node.
         *
         * This is a convenience function around the branch createNode method.  It chains a create with a
         * childOf() call.
         *
         * @chained new node
         *
         * @public
         *
         * @param {Object} [object] JSON object
         */
        createChild: function(object)
        {
            const self = this;

            // we can't assume we know the branch get since we're chaining
            // so create a temporary branch that we'll load later

            const branch = new Gitana.Branch(this.getRepository());

            // we hand back a node and preload some work
            const chainable = this.getFactory().node(branch);
            return this.subchain(chainable).then(function() {

                const chain = this;

                // we now plug in branch and create child node
                this.subchain(self).then(function() {

                    // load branch
                    branch.loadFrom(this.getBranch());

                    // create child node
                    this.subchain(branch).createNode(object).then(function() {

                        chain.loadFrom(this);

                        this.childOf(self);
                    });

                });

            });

        },

        /**
         * Associates this node as an "a:child" of the source node.
         *
         * This is a convenience function that simply creates an association from another node to this one.
         *
         * @chained node (this)
         *
         * @public
         *
         * @param {Node} sourceNode
         */
        childOf: function(sourceNode)
        {
            return this.associateOf(sourceNode, "a:child");
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // FIND
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Finds around a node.
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
         *       },
         *       "traverse: {
         *           ... Traversal Configuration
         *       }
         *    }
         *
         * Alternatively, the value for "search" in the JSON block above can simply be text.
         *
         * @public
         *
         * @param {Object} config search configuration
         * @param {Object} [pagination]
         */
        find: function(config, pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/find";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPost(chainable, uriFunction, params, config);
        },

        /**
         * Finds relatives of this node.
         *
         * Config should be:
         *
         *    {
         *       "query": {
         *           ... Query Block
         *       },
         *       "search": {
         *           ... Elastic Search Config Block
         *       },
         *       "traverse: {
         *           ... Traversal Configuration
         *       }
         *    }
         *
         * Alternatively, the value for "search" in the JSON block above can simply be text.
         *
         * The associationConfig should look like:
         *
         *    {
         *        "type": "",
         *        "direction": ""
         *    }
         *
         * @chained node map
         *
         * @public
         *
         * @param {Object} config
         * @param {Object} associationConfig
         * @param {Object} [pagination]
         */
        findRelatives: function(config, associationConfig, pagination)
        {
            let type = null;
            let direction = null;

            if (associationConfig)
            {
                type = associationConfig.type;
                if (associationConfig.direction)
                {
                    direction = associationConfig.direction.toUpperCase();
                }

                delete associationConfig.type;
                delete associationConfig.direction;
            }

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                let url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/relatives/find";
                if (type)
                {
                    url = url + "?type=" + type;
                }
                if (direction)
                {
                    if (type)
                    {
                        url = url + "&direction=" + direction;
                    }
                    else
                    {
                        url = url + "?direction=" + direction;
                    }
                }
                return url;
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPost(chainable, uriFunction, params, config);
        },

        /**
         * Retrieves a tree structure for nested folders starting at this node (as the root).
         *
         * @chained node
         *
         * @public
         *
         * @param {Object} config - { "leafPath": "<leafPath>", "basePath": "<basePath>", "containers": true, "depth": integer, "properties": true|false, "query": {}, "search": {} }
         * @param {Function} callback - the callback function to be passed the resulting tree object structure
         */
        loadTree: function(config, callback)
        {
            const self = this;

            if (typeof(config) === "function")
            {
                callback = config;
                config = null;
            }

            if (!config)
            {
                config = {};
            }

            const uriFunction = function()
            {
                return self.getUri() + "/tree";
            };

            const params = {};
            if (config.leafPath)
            {
                params["leaf"] = config.leafPath;
            }
            else if (config.leaf)
            {
                params["leaf"] = config.leaf;
            }
            if (config.basePath)
            {
                params["base"] = config.basePath;
            }
            else if (config.base)
            {
                params["base"] = config.base;
            }
            if (config.containers)
            {
                params["containers"] = true;
            }
            if (config.properties)
            {
                params["properties"] = true;
            }
            if (config.object)
            {
                params["object"] = true;
            }
            params.depth = 1;
            if (config.depth)
            {
                params["depth"] = config.depth;
            }

            const payload = {};
            if (config.query) {
                payload.query = config.query;
            }

            if(config.search) {
                payload.search = config.search;
            }

            return this.chainPostResponse(this, uriFunction, params, payload).then(function(response) {
                callback.call(this, response);
            });
        },

        /**
         * Resolves the path to this node relative to the given root node.
         *
         * @param {String} rootNodeId
         * @param {Function} callback
         * @returns {*}
         */
        resolvePath: function(rootNodeId, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/path";
            };

            const params = {
                "rootNodeId": rootNodeId
            };

            return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                callback.call(this, response.path);
            });

        },

        ////////////////////////////////////////
        //
        // VERSIONS
        //
        ////////////////////////////////////////

        listVersions: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function () {
                return this.getUri() + "/versions";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());

            return this.chainGet(chainable, uriFunction, params);
        },

        restoreVersion: function(changesetId)
        {
            const uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/versions/" + changesetId + "/restore";
            };

            const chainable = this.getFactory().node(this.getBranch());
            return this.chainPost(chainable, uriFunction, {}, {});
        },

        ////////////////////////////////////////
        //
        // MOVE A NODE TO ANOTHER FOLDER
        //
        ////////////////////////////////////////

        /**
         * Moves this node to another folder.
         *
         * @chained job
         *
         * @param targetFolder either a node or a node ID
         */
        moveToFolder: function(targetFolder)
        {
            const self = this;

            const params = {};
            params.targetNodeId = targetFolder.getId ? targetFolder.getId() : targetFolder;

            const uriFunction = function()
            {
                return self.getUri() + "/move";
            };

            // NOTE: pass control back to the server instance
            return this.chainPostEmpty(this, uriFunction, params);
        }

    });

})(window);
