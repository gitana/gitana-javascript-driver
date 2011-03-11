(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Form
     */
    Gitana.Form = Gitana.Node.extend(
    {
        constructor: function(branch, object)
        {
            this.base(branch, object);

            // priviledged functions
            // TODO
        },

        getEngineId: function()
        {
            return this["engineId"];
        },

        setEngineId: function(engineId)
        {
            this["engineId"] = engineId;
        }

    });

    Gitana.NodeFactory.register("n:form", Gitana.Form);

})(window);
