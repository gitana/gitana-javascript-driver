(function(window)
{
    var Gitana = window.Gitana;

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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Node";
        },

        /**
         * Acquires the "child nodes" of this node.  This is done by fetching all of the nodes that are outgoing-associated to this
         * node with a association of type "a:child".
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listChildren: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/children";
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
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
         * @param [Object] pagination
         */
        listRelatives: function(config, pagination)
        {
            var type = null;
            var direction = null;

            if (config)
            {
                type = config.type;
                if (config.direction)
                {
                    direction = config.direction.toUpperCase();
                }
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/relatives";
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

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },


        /**
         * Retrieves all of the association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param [Object] config
         * @param [Object] pagination
         */
        associations: function(config, pagination)
        {
            var type = null;
            var direction = null;

            if (config)
            {
                type = config.type;
                if (config.direction)
                {
                    direction = config.direction.toUpperCase();
                }
            }

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associations?a=1";
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

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Retrieves all of the incoming association objects for this node.
         *
         * @chained node map
         *
         * @public
         *
         * @param [String] type the type of association
         * @param [Object] pagination
         */
        incomingAssociations: function(type, pagination)
        {
            var config = {
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
         * @param [String] type the type of association
         * @param [Object] pagination
         */
        outgoingAssociations: function(type, pagination)
        {
            var config = {
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
         * @param {String|Node} targetNode the id of the target node or the target node itself
         * @param [Object|String] object either a JSON object or a string identifying the type of association
         * @param [Boolean] undirected whether the association is undirected (i.e. mutual)
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

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/associate?node=" + targetNodeId;

                if (undirected)
                {
                    url += "&directionality=UNDIRECTED";
                }

                return url;
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
        },

        /**
         * Creates an association from another node to this one.
         *
         * @chained node (this)
         *
         * @public
         *
         * @param sourceNode
         * @param object
         * @param undirected
         */
        associateOf: function(sourceNode, object, undirected)
        {
            var self = this;

            // what we're handing back (ourselves)
            var result = this.subchain(this);

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
         * @param {String|Node} targetNode the id of the target node or the target node itself
         * @param [String] type A string identifying the type of association
         * @param [Boolean] undirected whether the association is undirected (i.e. mutual)
         */
        unassociate: function(targetNodeId, type, undirected)
        {
            if (!Gitana.isString(targetNodeId))
            {
                targetNodeId = targetNodeId.getId();
            }

            var uriFunction = function()
            {
                var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unassociate?node=" + targetNodeId;

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

            return this.chainPostEmpty(this, uriFunction);
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
            var _this = this;

            // build the payload
            var payload = {
                "traverse": config
            };

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/traverse";
            };

            var chainable = this.getFactory().traversalResults(this.getBranch());
            var params = {};
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
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/mount/" + mountKey;
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
        },

        /**
         * Unmounts a node
         *
         * @public
         */
        unmount: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unmount";
            };

            return this.chainPostEmpty(this, uriFunction, null, object);
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
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
            };

            return this.chainPostEmpty(this, uriFunction);
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
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unlock";
            };

            return this.chainPostEmpty(this, uriFunction);
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

                var chain = this;

                // call
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock";
                this.getDriver().gitanaGet(uri, null, function(response) {

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
        loadACL: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl";
            };

            return this.chainGetResponse(this, uriFunction);
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
            var principalId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl?id=" + principalId;
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
         * @param callback
         */
        checkAuthority: function(principal, authorityId, callback)
        {
            var principalId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/check?id=" + principalId;
            };

            return this.chainPostResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["check"]);
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
            var principalId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/grant?id=" + principalId;
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
            var principalId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities/" + authorityId + "/revoke?id=" + principalId;
            };

            return this.chainPostEmpty(this, uriFunction);
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

            return this.chainPostResponse(this, "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/authorities", {}, json).then(function() {
                callback.call(this, this.response);
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
         * @param callback
         */
        checkPermission: function(principal, permissionId, callback)
        {
            var principalId = this.extractPrincipalDomainQualifiedId(principal);

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/permissions/" + permissionId + "/check?id=" + principalId;
            };

            return this.chainPostResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["check"]);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


        /**
         * Acquire a list of audit records concerning this node.
         *
         * @chained audit record map
         *
         * @public
         *
         * @param [Object] pagination
         */
        listAuditRecords: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/auditrecords";
            };

            var chainable = this.getFactory().auditRecordMap(this.getRepository());
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Creates a new translation.
         *
         * @chained translation node
         *
         * @param {String} edition the edition of the translation (can be any string)
         * @param {String} locale the locale string for the translation (i.e. "en_US")
         * @param [Object] object JSON object
         */
        createTranslation: function(edition, locale, object)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?edition=" + edition + "&locale=" + locale;
            };

            var chainable = this.getFactory().node(this.getBranch());
            return this.chainCreate(chainable, object, uriFunction);
        },

        /**
         * Lists all of the editions for this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param callback
         */
        editions: function(callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/editions"
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["editions"]);
            });
        },

        /**
         * Lists all of the locales for the given edition of this master node.
         * Passes them into the next function in the chain.
         *
         * @chained this
         *
         * @param {String} edition the edition
         * @param callback
         */
        locales: function(edition, callback)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n/locales?edition=" + edition;
            };

            return this.chainGetResponse(this, uriFunction).then(function() {
                callback.call(this, this.response["locales"]);
            });
        },

        /**
         * Reads a translation node of the current master node into a given locale and optional edition.
         * If an edition isn't provided, the tip edition from the master node is assumed.
         *
         * @chained translation node
         *
         * @param [String] edition The edition of the translation to use.  If not provided, the tip edition is used from the master node.
         * @param {String} locale The locale to translate into.
         */
        readTranslation: function()
        {
            var edition;
            var locale;

            var args = Gitana.makeArray(arguments);

            if (args.length == 1)
            {
                locale = args.shift();
            }
            else if (args.length > 1)
            {
                edition = args.shift();
                locale = args.shift();
            }

            var uriFunction = function()
            {
                var uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/i18n?locale=" + locale;
                if (edition)
                {
                    uri += "&edition=" + edition;
                }

                return uri;
            };

            var chainable = this.getFactory().node(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the attachments of this node.
         *
         * If local is set to true, the attachments are drawn from precached values on the node.
         *
         * @chained attachment map
         *
         * @public
         */
        listAttachments: function(local)
        {
            var self = this;

            var attachmentMap = new Gitana.NodeAttachmentMap(this);

            var result = this.subchain(attachmentMap);

            if (!local)
            {
                // front-load some work that fetches from remote server
                result.subchain().then(function() {

                    var chain = this;

                    self.getDriver().gitanaGet(self.getUri() + "/attachments", null, function(response) {

                        var map = {};
                        for (var i = 0; i < response.rows.length; i++)
                        {
                            map[response.rows[i]["_doc"]] = response.rows[i];
                        }
                        attachmentMap.handleMap(map);

                        chain.next();
                    });

                    return false;
                });
            }
            else
            {
                // try to populate the map from our cached values on the node (if they exist)
                var existingMap = this.getSystemMetadata()._system.attachments;

                var map = {};
                Gitana.copyInto(map, existingMap);

                attachmentMap.handleMap(map);
            }

            return result;
        },

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId (null for default)
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         * @param filename
         */
        attach: function(attachmentId, contentType, data, filename)
        {
            var self = this;

            if (!attachmentId)
            {
                attachmentId = "default";
            }

            // the thing we're handing back
            var result = this.subchain(new Gitana.NodeAttachment(this, attachmentId));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // params
                var params = {};
                if (filename)
                {
                    params["filename"] = filename;
                }

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, params, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listAttachments().select(attachmentId).then(function() {
                        result.handleAttachment(this.attachment);
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
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
         * @param [Object] object JSON object
         */
        createChild: function(object)
        {
            return this.subchain(this.getBranch()).createNode(object).childOf(this);
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
         * @param sourceNode
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
         */
        find: function(config, pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/find";
            };

            var chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainPost(chainable, uriFunction, params, config);
        }

    });

})(window);
