(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Abstract node class which provides base support to Gitana nodes.
     */
    Gitana.AbstractNode = Gitana.AbstractGitanaObject.extend(
    {
        constructor: function(branch, object)
        {
            this.base(branch.getDriver(), object);

            // priviledged methods
            this.getBranch = function() { return branch; };
            this.getBranchId = function() { return branch.getId(); };
            this.getRepository = function() { return branch.getRepository(); };
            this.getRepositoryId = function() { return branch.getRepository().getId(); };            
        },

        /**
         * Update the node.
         *
         * @param callback optional method
         */
        update: function(callback)
        {
            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId(), this, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Delete the node.
         *
         * @param callback
         */
        del: function(callback)
        {
            this.getBranch().nodes().del(this.getId(), callback);
        },

        /**
         * Gets the ids of features that this node has
         */
        getFeatureIds: function()
        {
            var featureIds = [];

            if (this["_features"])
            {
                for each (featureId in this["_features"])
                {
                    featuresIds[featureIds.length] = featureId;
                }
            }

            return featureIds;
        },

        /**
         * Gets the configuration for a given feature.
         *
         * @param featureId
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
         * @param featureId
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
         * @param featureId
         * @param featureConfig
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
         */
        getQName: function()
        {
            return this["_qname"];
        },

        /**
         * Gets the type QName for this node.
         */
        getTypeQName: function()
        {
            return this["_type"];
        },

        /**
         * Indicates whether this node has the "f:fs-container" feature
         */
        isFileSystemContainer: function()
        {
            return this.hasFeature("f:fs-container");
        }
    });

})(window);
