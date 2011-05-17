(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Branch = Gitana.AbstractObject.extend(
    /** @lends Gitana.Branch.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Branch
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository.getServer(), object);

            this.objectType = "Gitana.Branch";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };
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
            return this.getFactory().branch(this.getRepository(), this.object);
        },

        /**
         * @returns {Boolean} whether this is the master branch
         */
        isMaster: function()
        {
            return (this.getType().toLowerCase() == "master");
        },

        /**
         * @return {String} the type of branch ("master" or "custom")
         */
        getType: function()
        {
            return this.get("type");
        },

        /**
         * Reload.
         *
         * @chained this
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId()
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained this
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId()
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained server
         *
         * @public
         *
         * NOTE: not implemented but provided for NOOP consistency
         */
        del: function()
        {
            // TODO

            // NOTE: pass control back to the repository
            return this.subchain(this.getRepository()).then(function() {
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
         * @chained server
         *
         * @param callback
         */
        loadACL: function(callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl";
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId;
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId;
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId;
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
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId;
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

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Acquires a list of mount nodes under the root of the repository.
         *
         * @chained node map
         *
         * @public
         */
        listMounts: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads a node.
         *
         * @chained node
         *
         * @public
         *
         * @param {String} nodeId the node id
         */
        readNode: function(nodeId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/" + nodeId;
            };

            var chainable = this.getFactory().node(this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Create a node
         *
         * @chained node
         *
         * @public
         *
         * @param [Object] object JSON object
         */
        createNode: function(object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes";
            };

            var chainable = this.getFactory().node(this);
            return this.chainCreate(chainable, object, uriFunction);
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
         */
        searchNodes: function(search)
        {
            if (Gitana.isString(search))
            {
                search = {
                    "search": search
                };
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/search";
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, search);
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
         * @param query
         */
        queryNodes: function(query)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/nodes/query"
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainPost(chainable, uriFunction, query);
        },

        /**
         * Reads the person object for a security user.
         *
         * @chained node
         *
         * @param {String} userId
         * @param [Boolean] createIfNotFound whether to create the person object if it isn't found
         */
        readPerson: function(userId, createIfNotFound)
        {
            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/person/" + userId;
                if (createIfNotFound)
                {
                    uri += "?createIfNotFound=" + createIfNotFound;
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
         * @param {String} groupId
         * @param [Boolean] createIfNotFound whether to create the group object if it isn't found
         */
        readGroup: function(groupId, createIfNotFound)
        {
            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/group/" + groupId;
                if (createIfNotFound)
                {
                    uri += "?createIfNotFound=" + createIfNotFound;
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
         */
        listDefinitions: function(filter)
        {
            var uriFunction = function()
            {
                // uri
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/definitions";
                if (filter)
                {
                    uri = uri + "?filter=" + filter;
                }

                return uri;
            };

            var chainable = this.getFactory().nodeMap(this);
            return this.chainGet(chainable, uriFunction);
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
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/definitions/" + qname;
            };

            var chainable = this.getFactory().definition(this);
            return this.chainGet(chainable, uriFunction);
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
                var uri = "/repositories/" + self.getRepositoryId() + "/branches/" + self.getId() + "/qnames/generate";
                self.getDriver().gitanaPost(uri, object, function(response) {

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

            if (!object["_system"])
            {
                object["_system"] = {};
            }

            if (!object["_system"]["_features"])
            {
                object["_system"]["_features"] = {};
            }

            object["_system"]["_features"]["f:container"] = {
                "active": "true"
            };

            return this.createNode(object);
        }

    });

})(window);
