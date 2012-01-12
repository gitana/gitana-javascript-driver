(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Plan = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Plan.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Plan
         *
         * @param {Gitana.Registrar} registrar
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar.getPlatform(), object);

            this.objectType = "Gitana.Plan";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getRegistrar = function()
            {
                return registrar;
            };

            this.getRegistrarId = function()
            {
                return registrar.getId();
            };
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
            return this.getFactory().plan(this.getRegistrar(), this.object);
        },

        getPlanKey: function()
        {
            return this.get("planKey");
        }

    });

})(window);
