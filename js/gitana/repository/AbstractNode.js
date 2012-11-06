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
        handleSystemProperties: function(response)
        {
            this.base(response);

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
            if (this["stats"] && typeof(this["stats"]) == "object")
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
         * Override to include:
         *
         *   __qname
         *   __type
         *   __features
         *   __stats
         *   __is_association
         *
         * @param otherObject
         */
        chainCopyState: function(otherObject)
        {
            this.base(otherObject);

            if (otherObject.__qname) {
                this.__qname(otherObject.__qname());
            }
            if (otherObject.__type) {
                this.__type(otherObject.__type());
            }
            if (otherObject.__features) {
                this.__features(otherObject.__features());
            }
            if (otherObject.__stats) {
                this.__stats(otherObject.__stats());
            }
            if (otherObject.__is_association) {
                this.__is_association(otherObject.__is_association());
            }
        },

        /**
         * Hands back the stats.
         */
        stats: function()
        {
            return this.__stats();
        },


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // FEATURES
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back a list of the feature ids that this node has.
         *
         * @public
         *
         * @param [Function] callback optional callback
         *
         * @returns {Array} An array of strings that are the ids of the features.
         */
        getFeatureIds: function(callback)
        {
            var self = this;

            var f = function()
            {
                var featureIds = [];
                for (var featureId in this.__features()) {
                    featureIds[featureIds.length] = featureId;
                }

                return featureIds;
            };

            if (callback)
            {

                return this.then(function() {
                    callback.call(this, f.call(self));
                });
            }

            return f.call(self);
        },

        /**
         * Gets the configuration for a given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         * @param [Function] callback optional callback
         *
         * @returns {Object} the JSON object configuration for the feature
         */
        getFeature: function(featureId, callback)
        {
            var self = this;

            if (callback)
            {
                return this.then(function() {
                    callback.call(this, self.__features()[featureId]);
                });
            }

            return self.__features()[featureId];
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/features/" + featureId;
            };

            return this.chainDelete(this, uriFunction).reload().then(function() {
                self.loadFrom(this);
            });
        },

        /**
         * Adds a feature to this node.
         *
         * @public
         * @param {String} featureId the id of the feature
         * @param [Object] featureConfig the JSON object configuration for the feature
         */
        addFeature: function(featureId, featureConfig)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/features/" + featureId;
            };

            if (!featureConfig) {
                featureConfig = {};
            }

            return this.chainPostEmpty(this, uriFunction, {}, featureConfig).reload().then(function() {
                self.loadFrom(this);
            });
        },

        /**
         * Indicates whether this node has the given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         * @param [Function] callback optional callback to receive result (for chaining)
         *
         * @returns {Boolean} whether this node has this feature
         */
        hasFeature: function(featureId, callback)
        {
            if (callback)
            {
                return this.then(function() {

                    var hasFeature = !Gitana.isEmpty(this.__features()[featureId]);

                    callback.call(this, hasFeature);
                });
            }

            return !Gitana.isEmpty(this.__features()[featureId]);
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
            return this.__is_association();
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

            return this.chainPost(null, uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // TYPE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Gets the type QName for this node.
         *
         * @public
         *
         * @returns {String} the type qname of this node.
         */
        getTypeQName: function()
        {
            return this.__type();
        },

        /**
         * Changes the type QName for this node.
         *
         * @public
         * @param {String} typeQName the qname of the type to change to
         */
        changeTypeQName: function(typeQName)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/change_type?type=" + typeQName;
            };

            return this.chainPostEmpty(this, uriFunction).reload().then(function() {
                self.loadFrom(this);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // QNAME
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Gets the QName for this node.
         *
         * @public
         *
         * @returns {String} the qname of this node.
         */
        getQName: function()
        {
            return this.__qname();
        },

        /**
         * Sets the QName of this node.
         *
         * @public
         * @param {String} typeQName the qname of the type to change to
         */
        changeQName: function(qname)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/change_qname?qname=" + qname;
            };

            return this.chainPostEmpty(this, uriFunction).reload().then(function() {
                self.loadFrom(this);
            });
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
         * @param local
         *
         * @public
         */
        listAttachments: Gitana.Methods.listAttachments(Gitana.NodeAttachmentMap),

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
            var paramsFunction = function(params) {
                if (filename) { params["filename"] = filename; }
            };

            var delegate = Gitana.Methods.attach.call(this, Gitana.NodeAttachment, paramsFunction);
            return delegate.call(this, attachmentId, contentType, data);
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach()

    });

})(window);
