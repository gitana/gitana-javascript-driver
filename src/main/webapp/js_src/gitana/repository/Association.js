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
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_ASSOCIATION;
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
                    chainable.loadFrom(this);
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
                    chainable.loadFrom(this);
                });
            });
        },

        /**
         * Given a node, reads back the other node of the association.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @chained other node
         *
         * @param node
         */
        readOtherNode: function(node)
        {
            var self = this;

            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var result = this.subchain(this.getFactory().node(this.getBranch()));
            result.subchain(self).then(function() {

                if (nodeId == this.getSourceNodeId())
                {
                    this.readTargetNode().then(function() {
                        result.loadFrom(this);
                    });
                }
                else if (nodeId == this.getTargetNodeId())
                {
                    this.readSourceNode().then(function() {
                        result.loadFrom(this);
                    });
                }
                else
                {
                    var err = new Gitana.Error();
                    err.name = "No node on association";
                    err.message = "The node: " + nodeId + " was not found on this association";

                    this.error(err);

                    return false;
                }
            });

            return result;
        },

        /**
         * NOTE: this is not a chained function
         *
         * Given a node, determines what direction this association describes.
         *
         * If the association's directionality is UNDIRECTED, the direction is MUTUAL.
         *
         * If the association's directionality is DIRECTED...
         *   If the node is the source, the direction is OUTGOING.
         *   If the node is the target, the direction is INCOMING.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @returns {String} the direction or null if the node isn't on the association
         */
        getDirection: function(node)
        {
            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var direction = null;

            if (this.getDirectionality() == "UNDIRECTED")
            {
                direction = "MUTUAL";
            }
            else
            {
                if (this.getSourceNodeId() == nodeId)
                {
                    direction = "OUTGOING";
                }
                else if (this.getTargetNodeId() == nodeId)
                {
                    direction = "INCOMING";
                }
            }

            return direction;
        },

        /**
         * NOTE: this is not a chained function.
         *
         * Determines the node id of the other node.
         *
         * @param {Object} node either a Gitana.Node or a string with the node id
         *
         * @returns {String} the id of the other node
         */
        getOtherNodeId: function(node)
        {
            var nodeId = null;

            if (Gitana.isString(node))
            {
                nodeId = node;
            }
            else
            {
                nodeId = node.getId();
            }

            var otherNodeId = null;

            if (this.getSourceNodeId() == nodeId)
            {
                otherNodeId = this.getTargetNodeId();
            }
            else if (this.getTargetNodeId() == nodeId)
            {
                otherNodeId = this.getSourceNodeId();
            }

            return otherNodeId;
        }

    });

})(window);
