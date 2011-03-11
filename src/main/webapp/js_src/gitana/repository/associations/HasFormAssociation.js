(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Has Form Association
     */
    Gitana.HasFormAssociation = Gitana.Association.extend(
    {
        getFormKey: function()
        {
            return this["form-key"];
        },

        setFormKey: function(formKey)
        {
            this["form-key"] = formKey;
        }
    });

    Gitana.NodeFactory.register("a:has_form", Gitana.HasFormAssociation);

})(window);
