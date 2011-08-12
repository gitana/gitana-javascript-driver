(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractNode = Gitana.AbstractObject.extend(
    /** @lends Gitana.AbstractNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            this.base(branch.getServer(), object);


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
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().node(this.getBranch(), this.object);
        },

        /**
         * Acquires the stats for this node.  The stats may be out of sync with the server.  If you want to be
         * sure to bring them into sync, run reload() first.
         */
        stats: function()
        {
            var stats = this.get("stats");
            if (!stats)
            {
                stats = {};
            }

            return stats;
        },

        /**
         * Reload.
         *
         * @chained node
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update.
         *
         * @chained node
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },

        /**
         * Delete.
         *
         * @chained branch
         *
         * @public
         *
         * @param {String} nodeId the node id
         */
        del: function(nodeId)
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
            };

            // NOTE: pass control back to the branch
            return this.chainDelete(this.getBranch(), uriFunction);
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

            if (this.get("_features"))
            {
                for (var featureId in this.get("_features"))
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

            if (this.get("_features"))
            {
                featureConfig = this.get("_features")[featureId];
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
            if (this.get("_features"))
            {
                if (this.get("_features")[featureId])
                {
                    delete this.get("_features")[featureId];
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
            if (!this.get("_features"))
            {
                this.set("_features", {});
            }

            this.get("_features")[featureId] = featureConfig;
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

            if (this.get("_features"))
            {
                has = this.get("_features")[featureId];
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
            return this.get("_qname");
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
            return this.get("_type");
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
        },

        /**
         * Touches the node.  This allows the node to reindex and regenerate any renditions it may
         * have associated with it.
         *
         * @public
         *
         * @chained node (this)
         */
        touch: function()
        {
            var uriFunction = function()
            {
                return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId() + "/touch";
            };

            // NOTE: pass control back to the branch
            return this.chainPost(this.clone(), uriFunction);
        }
    });

})(window);
