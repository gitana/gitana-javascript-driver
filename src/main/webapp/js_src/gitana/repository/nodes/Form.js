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
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
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
            return this["engineId"];
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
            this["engineId"] = engineId;
        }

    });

    Gitana.NodeFactory.register("n:form", Gitana.Form);

})(window);
