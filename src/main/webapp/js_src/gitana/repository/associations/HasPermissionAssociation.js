(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Has Permission Association
     */
    Gitana.HasPermissionAssociation = Gitana.Association.extend(
    {
        getOperation: function()
        {
            return this["operation"];
        },

        setOperation: function(operation)
        {
            this["operation"] = operation;
        }
    });

    Gitana.NodeFactory.register("a:has_permission", Gitana.HasPermissionAssociation);

})(window);
