(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Association = Gitana.AbstractNode.extend(
    /** @lends Gitana.Association.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNode
         *
         * @class Association
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.Association";
        },

        /**
         * @override
         */
        isAssociation: function()
        {
            return true;
        },

        /**
         * @returns {String} the directionality of the association
         */
        getDirectionality: function()
        {
            return this.get("directionality");
        },

        /**
         * Gets the source node id for this association.
         *
         * @public
         *
         * @returns {String} source node id
         */
        getSourceNodeId: function()
        {
            return this.get("source");
        },

        /**
         * Gets the source node changeset id for this association.
         *
         * @public
         *
         * @returns {String} source node changeset id
         */
        getSourceNodeChangesetId: function()
        {
            return this.get("source_changeset");
        },

        /**
         * Gets the source node type for this association.
         *
         * @public
         *
         * @returns {String} source node type qname
         */
        getSourceNodeType: function()
        {
            return this.get("source_type");
        },

        /**
         * Gets the target node id for this association.
         *
         * @public
         *
         * @returns {String} target node id
         */
        getTargetNodeId: function()
        {
            return this.get("target");
        },

        /**
         * Gets the target node changeset id for this association.
         *
         * @public
         *
         * @returns {String} target node changeset id
         */
        getTargetNodeChangesetId: function()
        {
            return this.get("target_changeset");
        },

        /**
         * Gets the target node type for this association.
         *
         * @public
         *
         * @returns {String} target node type qname
         */
        getTargetNodeType: function()
        {
            return this.get("target_type");
        },

        /**
         * Reads the source node.
         *
         * @chained source node
         *
         * @public
         */
        readSourceNode: function()
        {
            var self = this;

            var chainable = this.getFactory().node(this.getBranch());
            return this.subchain(chainable).then(function() {

                var chain = this;

                this.subchain(self.getBranch()).readNode(self.getSourceNodeId()).then(function() {
                    chainable.handleResponse(this.object);
                });
            });
        },

        /**
         * Reads the target node.
         *
         * @chained target node
         *
         * @public
         */
        readTargetNode: function()
        {
            var self = this;

            var chainable = this.getFactory().node(this.getBranch());
            return this.subchain(chainable).then(function() {

                var chain = this;

                this.subchain(self.getBranch()).readNode(self.getTargetNodeId()).then(function() {
                    chainable.handleResponse(this.object);
                });
            });
        }

    });

})(window);
