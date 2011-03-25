(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Definition = Gitana.Node.extend(
    /** @lends Gitana.Definition.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Definition
         *
         * @param {Gitana.Branch} branch Gitana branch
         * @param {Object} object the JSON object
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the Forms API for this node
         *
         * @public
         *
         * @returns Gitana.Forms
         */
        forms: function()
        {
            return new Gitana.Forms(this);
        }

    });

    Gitana.NodeFactory.register("d:type", Gitana.Definition);
    Gitana.NodeFactory.register("d:feature", Gitana.Definition);
    Gitana.NodeFactory.register("d:association", Gitana.Definition);

})(window);
