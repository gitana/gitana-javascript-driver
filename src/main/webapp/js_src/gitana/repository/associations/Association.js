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
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * @override
         */
        isAssociation: function()
        {
            return true;
        },

        /**
         * @returns {String} the direction of the association
         */
        getDirection: function()
        {
            return this["direction"];
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
            return this["source"];
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
            return this["source_changeset"];
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
            return this["source_type"];
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
            return this["target"];
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
            return this["target_changeset"];
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
            return this["target_type"];
        },

        /**
         * Retrieves the source node for this association.
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        sourceNode: function(successCallback, failureCallback)
        {
            this.getBranch().nodes().read(this.getSourceNodeId(), successCallback, failureCallback);
        },

        /**
         * Retrieves teh target node for this association.
         *
         * @public
         * 
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        targetNode: function(successCallback, failureCallback)
        {
            this.getBranch().nodes().read(this.getTargetNodeId(), successCallback, failureCallback);
        }

    });

})(window);
