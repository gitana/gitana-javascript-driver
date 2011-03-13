(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Has Translation Association
     */
    Gitana.HasTranslationAssociation = Gitana.Association.extend(
    {
        getLocale: function()
        {
            return this["locale"];
        },

        setLocale: function(locale)
        {
            this["locale"] = locale;
        },

        getEdition: function()
        {
            return this["edition"];
        },

        setEdition: function(edition)
        {
            this["edition"] = edition;
        }

    });

    Gitana.NodeFactory.register("a:has_translation", Gitana.HasTranslationAssociation);

})(window);
