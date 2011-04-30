(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractNode = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.AbstractNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch The branch to on which the Gitana Node lives.
         * @param {Object} object The JSON object representing the Gitana Node.
         */
        constructor: function(branch, object)
        {
            this.base(branch.getDriver(), object);

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
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };

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
                return branch.getDriver().nodeFactory().produce(branch, object);
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
                return branch.getDriver().nodeFactory().list(branch, array);
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
                return branch.getDriver().nodeFactory().map(branch, array);
            };
        },

        /**
         * @override
         */
        reload: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(node)
            {
                _this.replacePropertiesWith(node);

                // OPTIONAL - successCallback
                if (successCallback)
                {
                    successCallback(node);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getBranch().nodes().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Updates the node.
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
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

            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId(), this, onSuccess, onFailure);
        },

        /**
         * Deletes the node.
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        del: function(successCallback, failureCallback)
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

            this.getBranch().nodes().del(this.getId(), onSuccess, onFailure);
        },

        /**
         * Hands back a list of the feature ids that this node has.
         *
         * @public
         *
         * @returns {Array} An array of strings that are the ids of the features.
         */
        getFeatureIds: function()
        {
            var featureIds = [];

            if (this["_features"])
            {
                for (featureId in this["_features"])
                {
                    featureIds[featureIds.length] = featureId;
                }
            }

            return featureIds;
        },

        /**
         * Gets the configuration for a given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         *
         * @returns {Object} the JSON object configuration for the feature
         */
        getFeature: function(featureId)
        {
            var featureConfig = null;

            if (this["_features"])
            {
                featureConfig = this["_features"][featureId];
            }

            return featureConfig;
        },

        /**
         * Removes a feature from this node.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         */
        removeFeature: function(featureId)
        {
            if (this["_features"])
            {
                if (this["features"][featureId])
                {
                    delete this["_features"][featureId];
                }
            }
        },

        /**
         * Adds a feature to this node.
         *
         * @public
         * @param {String} featureId the id of the feature
         * @param {Object} featureConfig the JSON object configuration for the feature
         */
        addFeature: function(featureId, featureConfig)
        {
            if (!this["_features"])
            {
                this["_features"] = { };
            }

            this["_features"][featureId] = featureConfig;
        },

        /**
         * Indicates whether this node has the given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         *
         * @returns {Boolean} whether this node has this feature
         */
        hasFeature: function(featureId)
        {
            var has = false;

            if (this["_features"])
            {
                has = this["_features"][featureId];
            }

            return has;
        },

        /**
         * Gets the QName for this node.
         *
         * @public
         *
         * @returns {String} the qname of this node.
         */
        getQName: function()
        {
            return this["_qname"];
        },

        /**
         * Gets the type QName for this node.
         *
         * @public
         *
         * @returns {String} the type qname of this node.
         */
        getTypeQName: function()
        {
            return this["_type"];
        },

        /**
         * Indicates whether the current object is an association.
         *
         * @public
         *
         * @returns {Boolean} whether this node is an association
         */
        isAssociation: function()
        {
            return false;
        },

        /**
         * Indicates whether this node has the "f:container" feature
         *
         * @public
         *
         * @returns {Boolean} whether this node has the "f:container" feature
         */
        isContainer: function()
        {
            return this.hasFeature("f:container");
        }
    });

})(window);
