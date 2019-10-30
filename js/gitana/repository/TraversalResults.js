(function(window)
{
    Gitana = window.Gitana;
    
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
         * @param {Object} object
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
            Gitana.deleteProperties(this._nodes, true);

            // empty the associations map
            Gitana.deleteProperties(this._associations, true);

            // empty the config map
            Gitana.deleteProperties(this._config, true);
        },

        /**
         * @override
         *
         * @param response
         */
        handleResponse: function(response)
        {
            this.clear();

            this.handleSystemProperties(response);

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
            const chainable = this.getFactory().node(this.getBranch());

            const result = this.subchain(chainable);

            // push our logic to the front
            result.subchain(this.getBranch()).readNode(this._config["center"]).then(function() {
                result.handleResponse(this);
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
            const self = this;

            // what we're handing back
            const result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // preload some work and hand back
            return result.then(function() {

                const chain = this;

                const response = {
                    "rows": self._nodes
                };

                chain.handleResponse(response);
            });
        },

        /**
         * Hands back a single node
         *
         * @chained node
         *
         * @param nodeId
         */
        node: function(nodeId)
        {
            const self = this;

            // hand back a node but preload with work
            const result = this.subchain(this.getFactory().node(this.getBranch()));
            return result.then(function() {

                const nodeObject = self._nodes[nodeId];
                if (!nodeObject) {
                    return self.missingNodeError(nodeId);
                }

                this.handleResponse(nodeObject);
            });
        },

        /**
         * Hands back a map of all of the associations in the traversal results
         *
         * @chained node map
         */
        associations: function()
        {
            const self = this;

            // what we're handing back
            const result = this.subchain(this.getFactory().nodeMap(this.getBranch()));

            // preload some work and hand back
            return result.then(function() {

                const chain = this;

                const response = {
                    "rows": self._associations
                };

                chain.handleResponse(response);
            });
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
            const self = this;

            // hand back a node but preload with work
            const result = this.subchain(this.getFactory().association(this.getBranch()));
            return result.then(function() {

                const associationObject = self._associations[id];
                if (!associationObject) {
                    return self.missingNodeError(id);
                }

                this.handleResponse(associationObject);
            });
        }

    });

})(window);
