(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Form = Gitana.Node.extend(
    /** @lends Gitana.Form.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Form
         *
         * @param {Gitana.Branch} branch
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = function() { return "Gitana.Form"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().form(this.getBranch(), this);
        },

        /**
         * Gets the engine id for this form.
         *
         * @public
         *
         * @returns {String} engine id
         */
        getEngineId: function()
        {
            return this.get("engineId");
        },

        /**
         * Sets the engine id for this form.
         *
         * @public
         *
         * @param engineId
         */
        setEngineId: function(engineId)
        {
            this.set("engineId", engineId);
        }

    });

    Gitana.ObjectFactory.register("n:form", Gitana.Form);

})(window);
