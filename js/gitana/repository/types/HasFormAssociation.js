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
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = function() { return "Gitana.HasFormAssociation"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.HasFormAssociation(this.getBranch(), this);
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
            return this.get("form-key");
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
            this.set("form-key", formKey);
        }
    });

    Gitana.ObjectFactory.register("a:has_form", Gitana.HasFormAssociation);

})(window);
