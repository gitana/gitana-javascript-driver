(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Association
     */
    Gitana.Association = Gitana.AbstractNode.extend(
    {
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        getSourceNodeId: function()
        {
            return this["source_node_id"];
        },

        getSourceNodeChangesetId: function()
        {
            return this["source_node_changeset_id"];
        },

        getSourceNodeType: function()
        {
            return this["source_node_type_id"];
        },

        getTargetNodeId: function()
        {
            return this["target_node_id"];
        },

        getTargetNodeChangesetId: function()
        {
            return this["target_node_changeset_id"];
        },

        getTargetNodeType: function()
        {
            return this["target_node_type_id"];
        },

        sourceNode: function(callback)
        {
            this.getBranch().nodes().read(this.getSourceNodeId(), callback);
        },

        targetNode: function(callback)
        {
            this.getBranch().nodes().read(this.getTargetNodeId(), callback);
        }

    });

})(window);
