(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Nodes = Gitana.AbstractBranchService.extend(
    /** @lends Gitana.Nodes.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractBranchService
         *
         * @class Node service
         *
         * @param {Gitana.Branch} branch The branch to which the service should be constrained.
         */
        constructor: function(branch)
        {
            this.base(branch);
        },
        
        /**
         * Acquires a list of mount nodes under the root of the repository.
         *
         * @public
         * 
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        list: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", onSuccess, onFailure);
        },

        /**
         * Reads a node.
         *
         * @public
         *
         * @param {String} nodeId the node id
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(nodeId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, onSuccess, onFailure);
        },

        /**
         * Create a node
         *
         * @public
         *
         * @param [Object] object JSON object
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var object = null;
            var successCallback = null;
            var failureCallback = null;
            if (args.length == 1)
            {
                successCallback = args.shift();
            }
            else if (args.length == 2)
            {
                object = args.shift();
                successCallback = args.shift();
            }
            else if (args.length == 3)
            {
                object = args.shift();
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(response)
            {
                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", object, onSuccess, onFailure);
        },

        /**
         * Delete a node
         *
         * @public
         *
         * @param {String} nodeId the node id
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        del: function(nodeId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaDelete("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, onSuccess, onFailure);
        },


        /**
         * Searches the branch.
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
         * @param config
         * @param successCallback
         * @param failureCallback
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

            // support for simplified full-text search configuration
            if (this.isString(config))
            {
                config = { "search": config };
            }

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/search", config, onSuccess, onFailure);
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
         * @public
         *
         * @param config
         * @param successCallback
         * @param failureCallback
         */
        query: function(config, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/query", config, onSuccess, onFailure);
        },
        
        /**
         * Reads the person object for a security user.
         *
         * @param {String} userId
         * @param [Boolean] createIfNotFound whether to create the person object if it isn't found
         * @param [Function] successCallback
         * @param [Function] failureCallback
         */
        readPerson: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var userId = args.shift();
            var createIfNotFound = false;
            var successCallback = null;
            var failureCallback = null;

            var a1 = args.shift();
            if (this.isFunction(a1))
            {
                successCallback = a1;
                failureCallback = args.shift();
            }
            else
            {
                createIfNotFound = a1;
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/person/" + userId + "?createIfNotFound=" + createIfNotFound, onSuccess, onFailure);
        },

        /**
         * Reads the group object for a security group.
         *
         * @param {String} groupId
         * @param [Boolean] createIfNotFound whether to create the group object if it isn't found
         * @param [Function] successCallback
         * @param [Function] failureCallback
         */
        readGroup: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var groupId = args.shift();
            var createIfNotFound = false;
            var successCallback = null;
            var failureCallback = null;

            var a1 = args.shift();
            if (this.isFunction(a1))
            {
                successCallback = a1;
                failureCallback = args.shift();
            }
            else
            {
                createIfNotFound = a1;
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/group/" + groupId + "?createIfNotFound=" + createIfNotFound, onSuccess, onFailure);
        }        

    });

})(window);
