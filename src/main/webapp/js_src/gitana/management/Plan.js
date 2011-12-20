(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Plan = Gitana.AbstractSelfableObject.extend(
    /** @lends Gitana.Plan.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Plan
         *
         * @param {Gitana.Management} management
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(management, object)
        {
            this.base(management.getPlatform(), object);

            this.getManagement = function()
            {
                return management;
            };

            this.objectType = "Gitana.Plan";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/plans/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().plan(this.getManagement(), this.object);
        },

        getPlanKey: function()
        {
            return this.get("planKey");
        }

    });

})(window);
