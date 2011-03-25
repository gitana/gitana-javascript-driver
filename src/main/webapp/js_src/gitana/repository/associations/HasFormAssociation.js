(function(window)
{
    var Gitana = window.Gitana;

    Gitana.HasFormAssociation = Gitana.Association.extend(
    /** @lends Gitana.HasFormAssociation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Association
         *
         * @class Has Form Association
         *
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the form key for the association.
         *
         * @public
         *
         * @returns {String} form key
         */
        getFormKey: function()
        {
            return this["form-key"];
        },

        /**
         * Sets the form key for the association.
         *
         * @public
         * 
         * @param formKey
         */
        setFormKey: function(formKey)
        {
            this["form-key"] = formKey;
        }
    });

    Gitana.NodeFactory.register("a:has_form", Gitana.HasFormAssociation);

})(window);
