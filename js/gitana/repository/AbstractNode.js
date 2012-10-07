(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractNode = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            // helper methods for system-managed state

            this.__qname = (function() {
                var _qname = null;
                return function(qname) {
                    if (qname) { _qname = qname; }
                    return _qname;
                }
            })();

            this.__type = (function() {
                var _type = null;
                return function(type) {
                    if (type) { _type = type; }
                    return _type;
                }
            })();

            this.__features = (function() {
                var _features = {};
                return function(features) {
                    if (features) { _features = features; }
                    return _features;
                }
            })();

            this.__stats = (function() {
                var _stats = {};
                return function(stats) {
                    if (stats) { _stats = stats; }
                    return _stats;
                }
            })();

            this.__is_association = (function() {
                var _is_association = false;
                return function(is_association) {
                    if (!Gitana.isUndefined(is_association)) { _is_association = is_association; }
                    return _is_association;
                }
            })();

            // now call base
            // important this happens AFTER helpers above so that handleSystemProperties works
            this.base(branch.getPlatform(), object);


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
            return this.getFactory().node(this.getBranch(), this);
        },

        /**
         * @override
         */
        handleSystemProperties: function()
        {
            this.base();

            // strip out "_qname"
            if (this["_qname"])
            {
                var _qname = this["_qname"];
                delete this["_qname"];
                this.__qname(_qname);
            }

            // strip out "_type"
            if (this["_type"])
            {
                var _type = this["_type"];
                delete this["_type"];
                this.__type(_type);
            }

            // strip out "_features"
            if (this["_features"])
            {
                var _features = this["_features"];
                delete this["_features"];
                this.__features(_features);
            }

            // strip out "stats"
            if (this["stats"])
            {
                var stats = this["stats"];
                delete this["stats"];
                this.__stats(stats);
            }

            // strip out "_is_association"
            if (!Gitana.isUndefined(this["_is_association"]))
            {
                var _is_association = this["_is_association"];
                delete this["_is_association"];
                this.__is_association(_is_association);
            }
        },

        /**
         * Hands back the stats.
         */
        stats: function()
        {
            return this.__stats();
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

            for (var featureId in this._features())
            {
                featureIds[featureIds.length] = featureId;
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
            return this._features()[featureId];
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
            if (this._features()[featureId])
            {
                delete this._features()[featureId]
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
            this._features()[featureId] = featureConfig;
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
            return !Gitana.isEmpty(this._features()[featureId]);
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
            return this._qname();
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
            return this._type();
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
            return this._is_association();
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/touch";
            };

            // NOTE: pass control back to the branch
            return this.chainPost(this.clone(), uriFunction);
        }
    });

})(window);
