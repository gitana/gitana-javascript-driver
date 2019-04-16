(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Plan = Gitana.AbstractRegistrarObject.extend(
    /** @lends Gitana.Plan.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRegistrarObject
         *
         * @class Plan
         *
         * @param {Gitana.Registrar} registrar
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar, object);

            this.objectType = function() { return "Gitana.Plan"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_PLAN;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/registrars/" + this.getRegistrarId() + "/plans/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().plan(this.getRegistrar(), this);
        },

        getPlanKey: function()
        {
            return this.get("planKey");
        }

    });

})(window);
