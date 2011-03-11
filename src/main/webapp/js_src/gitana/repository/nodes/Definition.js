(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Definition
     */
    Gitana.Definition = Gitana.Node.extend(
    {
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Gets the forms API for this branch
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
