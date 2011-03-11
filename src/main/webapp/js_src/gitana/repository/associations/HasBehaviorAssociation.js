(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Has Permission Association
     */
    Gitana.HasPermissionAssociation = Gitana.Association.extend(
    {
    });

    Gitana.NodeFactory.register("a:has_behavior", Gitana.HasPermissionAssociation);

})(window);
