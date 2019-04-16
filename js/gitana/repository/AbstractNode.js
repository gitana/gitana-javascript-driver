(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractNode = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.AbstractNode.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch
         * @param {Object} [object]
         */
        constructor: function(branch, object)
        {
            // helper methods for system-managed state

            this.__qname = (function() {
                let _qname = null;
                return function(qname) {
                    if (!Gitana.isUndefined(qname)) { _qname = qname; }
                    return _qname;
                };
            })();

            this.__type = (function() {
                let _type = null;
                return function(type) {
                    if (!Gitana.isUndefined(type)) { _type = type; }
                    return _type;
                };
            })();

            this.__features = (function() {
                let _features = {};
                return function(features) {
                    if (!Gitana.isUndefined(features)) { _features = features; }
                    return _features;
                };
            })();

            this.__stats = (function() {
                let _stats = {};
                return function(stats) {
                    if (!Gitana.isUndefined(stats)) { _stats = stats; }
                    return _stats;
                };
            })();

            this.__is_association = (function() {
                let _is_association = false;
                return function(is_association) {
                    if (!Gitana.isUndefined(is_association)) { _is_association = is_association; }
                    return _is_association;
                };
            })();

            // now call base
            // important this happens AFTER helpers above so that handleSystemProperties works
            this.base(branch.getRepository(), object);


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

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
         * @override
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getId();
        },

        /**
         * @override
         */
        ref: function()
        {
            return "node://" + this.getPlatformId() + "/" + this.getRepositoryId() + "/" + this.getBranchId() + "/" + this.getId();
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
                const _qname = this["_qname"];
                delete this["_qname"];
                this.__qname(_qname);
            }

            // strip out "_type"
            if (this["_type"])
            {
                const _type = this["_type"];
                delete this["_type"];
                this.__type(_type);
            }

            // strip out "_features"
            if (this["_features"])
            {
                const _features = this["_features"];
                delete this["_features"];
                this.__features(_features);
            }

            // strip out "_statistics"
            if (this["_statistics"] && typeof(this["_statistics"]) === "object")
            {
                const stats = this["_statistics"];
                delete this["_statistics"];
                this.__stats(stats);
            }

            // strip out "_is_association"
            if (!Gitana.isUndefined(this["_is_association"]))
            {
                const _is_association = this["_is_association"];
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
         * @param {Function} callback optional callback
         *
         * @returns {Array} An array of strings that are the ids of the features.
         */
        getFeatureIds: function(callback)
        {
            const self = this;

            const f = function()
            {
                const featureIds = [];
                for (const featureId in this.__features()) {
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
         * @param {Function} callback optional callback
         *
         * @returns {Object} the JSON object configuration for the feature
         */
        getFeature: function(featureId, callback)
        {
            const self = this;

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
            const self = this;

            const uriFunction = function()
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
         * @param {Object} featureConfig the JSON object configuration for the feature
         */
        addFeature: function(featureId, featureConfig)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/features/" + featureId;
            };

            if (!featureConfig) {
                featureConfig = {};
            }

            return this.chainPostEmpty(null, uriFunction, {}, featureConfig).reload().then(function() {
                self.loadFrom(this);
            });
        },

        /**
         * Indicates whether this node has the given feature.
         *
         * @public
         *
         * @param {String} featureId the id of the feature
         * @param {Function} callback optional callback to receive result (for chaining)
         *
         * @returns {Boolean} whether this node has this feature
         */
        hasFeature: function(featureId, callback = undefined)
        {
            if (callback)
            {
                return this.then(function() {

                    const hasFeature = !Gitana.isEmpty(this.__features()[featureId]);

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
            const self = this;

            const uriFunction = function()
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
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/change_type?type=" + typeQName;
            };

            return this.chainPostEmpty(null, uriFunction).reload().then(function() {
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
         * @param {String} qname the qname of the type to change to
         */
        changeQName: function(qname)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/change_qname?qname=" + qname;
            };

            return this.chainPostEmpty(null, uriFunction).reload().then(function() {
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
         * Non-chained method for getting a download URI for this node's attachment.
         */
        attachmentDownloadUri: function(attachmentId)
        {
            return this.getDriver().baseURL + this.getUri() + "/attachments/" + attachmentId;
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
            const paramsFunction = function(params) {
                if (filename) { params["filename"] = filename; }
            };

            const delegate = Gitana.Methods.attach.call(this, Gitana.NodeAttachment, paramsFunction);
            return delegate.call(this, attachmentId, contentType, data);
        },

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri(),


        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach()

    });

})(window);
