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
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the translations API for this node
         *
         * @public
         *
         * @returns {Gitana.Translations} the Translations API
         */
        translations: function()
        {
            return new Gitana.Translations(this);
        },

        /**
         * Acquires the "child nodes" of this node.  This is done by fetching all of the nodes that are outgoing-associated to this
         * node with a association of type "a:child".
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        children: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/children", onSuccess, onFailure);
        },

        /**
         * Retrieves all of the incoming association objects for this node.
         *
         * @public
         *
         * @param [String] type the type of association
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        incomingAssociations: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var type = null;
            var successCallback = null;
            var failureCallback = null;

            if (args.length == 1)
            {
                successCallback = args.shift();
            }
            else
            {
                var a1 = args.shift();
                if (this.isFunction(a1))
                {
                    successCallback = a1;
                    failureCallback = a2;
                }
                else if (this.isString(a1))
                {
                    type = a1;
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/incoming";
            if (type)
            {
                url = url + "?type=" + type;
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        },

        /**
         * Retrieves all of the outgoing association objects for this node.
         *
         * @public
         *
         * @param [String] type the type of association
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        outgoingAssociations: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var type = null;
            var successCallback = null;
            var failureCallback = null;

            if (args.length == 1)
            {
                successCallback = args.shift();
            }
            else
            {
                var a1 = args.shift();
                if (this.isFunction(a1))
                {
                    successCallback = a1;
                    failureCallback = a2;
                }
                else if (this.isString(a1))
                {
                    type = a1;
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/outgoing";
            if (type)
            {
                url = url + "?type=" + type;
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        },

        /**
         * Associates a target node to this node.
         *
         * @public
         *
         * @param {String} targetNodeId the id of the target node
         * @param [Object|String] object Either a JSON object or a string identifying the type of association
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        associate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var targetNodeId = args.shift();
            var object = {};
            var successCallback = null;
            var failureCallback = null;
            if (args.length > 0)
            {
                var a1 = args.shift();
                if (this.isFunction(a1))
                {
                    successCallback = a1;
                    failureCallback = args.shift();
                }
                else
                {
                    if (this.isString(a1))
                    {
                        object = {
                            "_type": a1
                        };
                    }
                    else
                    {
                        object = a1;
                    }
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/associate?node=" + targetNodeId;
            this.getDriver().gitanaPost(url, object, onSuccess, onFailure);
        },

        /**
         * Unassociates a target node from this node.
         *
         * @public
         *
         * @param {String} targetNodeId the id of the target node
         * @param [String] type A string identifying the type of association
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        unassociate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var targetNodeId = args.shift();
            var type = null;
            var successCallback = null;
            var failureCallback = null;
            if (args.length > 0)
            {
                var a1 = args.shift();
                if (this.isFunction(a1))
                {
                    successCallback = a1;
                    failureCallback = args.shift();
                }
                else
                {
                    type = a1;
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/unassociate?node=" + targetNodeId;
            if (type)
            {
                url = url + "&type=" + type;
            }
            this.getDriver().gitanaPost(url, {}, onSuccess, onFailure);
        },

        /**
         * Traverses around the node and returns any nodes found to be connected on the graph.
         *
         * Example config:
         *
         * {
         *    "associations": {
         *       "a:child": "BOTH",
         *       "a:knows": "INCOMING",
         *       "a:related": "OUTGOING"
         *    },
         *    "depth": 1,
         *    "types": [ "custom:type1", "custom:type2" ]
         * } 
         *
         * @public
         *
         * @param {Object} config configuration for the traversal
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        traverse: function(config, successCallback, failureCallback)
        {
            var _this = this;

            // build the payload
            var payload = {
                "traverse": config
            };

            var onSuccess = function(response)
            {
                // convert the nodes to a node list as well as a node map
                response.nodeList = _this.buildList(response.nodes);
                response.nodeMap = _this.buildMap(response.nodes);
                response.associationList = _this.buildList(response.associations);
                response.associationMap = _this.buildMap(response.associations);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/traverse";
            this.getDriver().gitanaPost(url, payload, onSuccess, onFailure);
        },

        /**
         * Mounts a node
         *
         * @public
         *
         * @param {String} mountKey the mount key
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        mount: function(mountKey, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/mount/" + mountKey;
            this.getDriver().gitanaPost(url, {}, onSuccess, onFailure);
        },

        /**
         * Unmounts a node
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        unmount: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/unmount";
            this.getDriver().gitanaPost(url, {}, onSuccess, onFailure);
        },

        /**
         * Searches around this node.
         *
         * Config should be:
         *
         *    {
         *       "traverse: {
         *           ... Traversal Configuration
         *       },
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * For a full text search, you can simply provide text for the search field:
         *
         *    {
         *       "traverse: {
         *       },
         *       "search": "searchTerm"
         *    }
         *
         * See the Elastic Search documentation for more advanced examples
         *
         * @public
         *
         * @param {Object} config search configuration
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        search: function(config, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/search", config, onSuccess, onFailure);
        },

        /**
         * Locks a node
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        lock: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                if (successCallback)
                {
                    successCallback(status);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock", {}, onSuccess, onFailure);
        },

        /**
         * Unlocks a node
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        unlock: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                if (successCallback)
                {
                    successCallback(status);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/unlock", {}, onSuccess, onFailure);
        },

        /**
         * Determines whether a node is locked
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        isLocked: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                if (successCallback)
                {
                    successCallback(status["locked"]);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/lock", onSuccess, onFailure);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieves the full ACL list.
         *
         * @param {Function} successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        lookupACL: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl", onSuccess, onFailure);
        },

        /**
         * Hands back the authorities that the given principal has.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        listAuthorities: function(principal, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId, onSuccess, onFailure);
        },

        /**
         * Checks whether the given principal has an authority.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        checkAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(authorities)
            {
                var has = false;

                for (var i = 0; i < authorities.length; i++)
                {
                    if (authorities[i] == authorityId)
                    {
                        has = true;
                        break;
                    }
                }

                successCallback(has);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.listAuthorities(principal, onSuccess, onFailure);
        },

        /**
         * Grants an authority to a principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        grantAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId, {}, onSuccess, onFailure);
        },

        /**
         * Revokes an authority from a principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId, {}, onSuccess, onFailure);
        },

        /**
         * Revokes all authorities for a principal against the server.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAllAuthorities: function(principal, successCallback, failureCallback)
        {
            this.revokeAuthority(principal, "all", successCallback, failureCallback);
        }

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

    });

})(window);
