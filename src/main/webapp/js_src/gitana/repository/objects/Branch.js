(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Branch = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.Branch.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Branch
         *
         * @param {Gitana.Repository} repository
         * @param {Object} object JSON object
         */
        constructor: function(repository, object)
        {
            this.base(repository.getDriver(), object);

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

            /**
             * Builds a node for the given JSON object.
             *
             * @param {Object} JSON object representing the node
             *
             * @inner
             *
             * @returns {Gitana.Node} the Gitana Node
             */
            this.build = function(object)
            {
                return this.getDriver().nodeFactory().produce(branch, object);
            };

            /**
             * Builds a list of nodes for a given array of JSON objects.
             *
             * @inner
             *
             * @returns {Array} An array of Gitana Node objects.
             */
            this.buildList = function(array)
            {
                return this.getDriver().nodeFactory().list(branch, array);
            };

            /**
             * Builds a map of nodes for a given array of JSON objects.
             *
             * @inner
             *
             * @returns {Object} A map of Gitana Node objects keyed by node id
             */
            this.buildMap = function(array)
            {
                return this.getDriver().nodeFactory().map(branch, array);
            };
        },

        /**
         * Gets the Nodes API for this branch
         *
         * @public
         *
         * @returns {Gitana.Nodes} Nodes API
         */
        nodes: function()
        {
            return new Gitana.Nodes(this);
        },

        /**
         * Gets the Definitions API for this branch
         *
         * @public
         *
         * @returns {Gitana.Definitions} Definitions API
         */
        definitions: function()
        {
            return new Gitana.Definitions(this);
        },

        /**
         * Gets the branch helper function API
         *
         * @public
         *
         * @returns {Gitana.BranchHelpers} Helpers API
         */
        helpers: function()
        {
            return new Gitana.BranchHelpers(this);
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
            return this["type"];
        },

        /**
         * @override
         */
        reload: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(branch)
            {
                _this.replacePropertiesWith(branch);

                if (successCallback)
                {
                    successCallback(branch);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getRepository().branches().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Updates this branch.
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        update: function(successCallback, failureCallback)
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
            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId(), this, onSuccess, onFailure);
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
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/search", config, onSuccess, onFailure);
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
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl", onSuccess, onFailure);
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
            var principalId = this.extractPrincipalId(principal);

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId, onSuccess, onFailure);
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

            // figure out the principal id
            var principalId = this.extractPrincipalId(principal);

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
            var principalId = this.extractPrincipalId(principal);

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId, {}, onSuccess, onFailure);
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
            var principalId = this.extractPrincipalId(principal);

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId, {}, onSuccess, onFailure);
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
