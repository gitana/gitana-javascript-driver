(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TraversalResults = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.TraversalResults.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Provides access to traversal results
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            if (!this._nodes)
            {
                this._nodes = {};
            }
            if (!this._associations)
            {
                this._associations = {};
            }
            if (!this._config)
            {
                this._config = {};
            }

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
        },

        clear: function()
        {
            // empty the nodes map
            for (var i in this._nodes) {
                if (this._nodes.hasOwnProperty(i)) {
                    delete this._nodes[i];
                }
            }

            // empty the associations map
            for (var i in this._associations) {
                if (this._associations.hasOwnProperty(i)) {
                    delete this._associations[i];
                }
            }

            // empty the config map
            for (var i in this._config) {
                if (this._config.hasOwnProperty(i)) {
                    delete this._config[i];
                }
            }
        },

        /**
         * @override
         *
         * @param response
         */
        handleResponse: function(response)
        {
            this.base(response);

            this.clear();

            // copy nodes and associations map values
            Gitana.copyInto(this._nodes, response.nodes);
            Gitana.copyInto(this._associations, response.associations);

            // copy config
            Gitana.copyInto(this._config, response.config);

            // copy center node information
            this._config["center"] = response.node;
        },

        /**
         * Looks up the node around which this traversal is centered.
         */
        center: function()
        {
            var chainable = this.getFactory().node(this.getBranch());

            var result = this.subchain(chainable);

            // push our logic to the front
            result.subchain(this.getBranch()).readNode(this._config["center"]).then(function() {
                result.handleResponse(this.object);
            });

            return result;
        },

        /**
         * Counts the number of nodes in the traversal results
         *
         * @param callback
         */
        nodeCount: function(callback)
        {
            return this.then(function() {
                callback.call(this, Gitana.getNumberOfKeys(this._nodes));
            });
        },

        /**
         * Counts the number of associations in teh traversal results
         *
         * @param callback
         */
        associationCount: function(callback)
        {
            return this.then(function() {
                callback.call(this, Gitana.getNumberOfKeys(this._associations));
            });
        },

        /**
         * Hands back a map of all of the nodes in the traversal results
         *
         * @chained node map
         */
        nodes: function()
        {
            var self = this;

            // what we're handing back
            var result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // subchain at front to load
            result.subchain().then(function() {

                var response = {
                    "rows": self._nodes
                };

                result.handleResponse(response);
            });

            return result;
        },

        /**
         * Hands back a single node
         *
         * @chained node
         *
         * @param nodeId
         */
        node: function(id)
        {
            var self = this;

            // node
            var result = this.subchain(this.getFactory().node(this.getBranch()));

            result.subchain(self).then(function() {
                this.nodes().then(function() {
                    var node = this.get(id);
                    if (node)
                    {
                        result.handleResponse(node.object);
                    }
                    else
                    {
                        // NOTE: return here so that we don't continue processing beyond this link
                        return self.missingNodeError(id);
                    }
                });
            });

            return result;
        },

        /**
         * Hands back a map of all of the associations in the traversal results
         *
         * @chained node map
         */
        associations: function()
        {
            var self = this;

            // what we're handing back
            var result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // subchain at front to load
            result.subchain().then(function() {

                var response = {
                    "rows": self._associations
                };

                result.handleResponse(response);
            });

            return result;
        },

        /**
         * Hands back a single association.
         *
         * @chained association
         *
         * @param id
         */
        association: function(id)
        {
            var self = this;

            var result = this.subchain(this.getFactory().association(this.getBranch()));

            result.subchain().then(function() {
                this.associations().then(function() {
                    var node = this.get(id);
                    if (node)
                    {
                        result.handleResponse(node.object);
                    }
                    else
                    {
                        // NOTE: return here so that we don't continue processing beyond this link
                        return self.missingNodeError(id);
                    }
                });
            });

            return result;
        }

    });

})(window);
