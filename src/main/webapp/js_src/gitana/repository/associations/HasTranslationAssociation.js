(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasTranslationAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasTranslationAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Translation Association
         *
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the locale of this association.
         *
         * @returns {String} locale
         */
        getLocale: function()
        {
            return this["locale"];
        },

        /**
         * Sets the locale of this association.
         *
         * @param locale
         */
        setLocale: function(locale)
        {
            this["locale"] = locale;
        },

        /**
         * Gets the edition of this association.
         *
         * @returns {String} edition
         */
        getEdition: function()
        {
            return this["edition"];
        },

        /**
         * Sets the edition of this association.
         *
         * @param edition
         */
        setEdition: function(edition)
        {
            this["edition"] = edition;
        }

    });

    Gitana.NodeFactory.register("a:has_translation", Gitana.HasTranslationAssociation);

})(window);
