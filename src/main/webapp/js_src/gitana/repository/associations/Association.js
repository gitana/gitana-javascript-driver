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

        /**
         * @Override
         */
        isAssociation: function()
        {
            return true;
        },

        getSourceNodeId: function()
        {
            return this["source"];
        },

        getSourceNodeChangesetId: function()
        {
            return this["source_changeset"];
        },

        getSourceNodeType: function()
        {
            return this["source_type"];
        },

        getTargetNodeId: function()
        {
            return this["target"];
        },

        getTargetNodeChangesetId: function()
        {
            return this["target_changeset"];
        },

        getTargetNodeType: function()
        {
            return this["target_type"];
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
