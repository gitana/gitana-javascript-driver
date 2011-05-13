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
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = "Gitana.HasTranslationAssociation";
        },

        /**
         * Gets the locale of this association.
         *
         * @returns {String} locale
         */
        getLocale: function()
        {
            return this.object["locale"];
        },

        /**
         * Sets the locale of this association.
         *
         * @param locale
         */
        setLocale: function(locale)
        {
            this.object["locale"] = locale;
        },

        /**
         * Gets the edition of this association.
         *
         * @returns {String} edition
         */
        getEdition: function()
        {
            return this.object["edition"];
        },

        /**
         * Sets the edition of this association.
         *
         * @param edition
         */
        setEdition: function(edition)
        {
            this.object["edition"] = edition;
        }

    });

    Gitana.ObjectFactory.register("a:has_translation", Gitana.HasTranslationAssociation);

})(window);
