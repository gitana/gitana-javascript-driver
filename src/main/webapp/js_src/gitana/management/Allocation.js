(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Allocation = Gitana.AbstractSelfableObject.extend(
    /** @lends Gitana.Allocation.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Allocation
         *
         * @param {Gitana.Management} management
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(management, object)
        {
            this.base(platform, object);

            this.getManagement = function()
            {
                return management;
            };

            this.objectType = "Gitana.Allocation";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/tenants/" + this.getTenantId() + "/allocations/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().allocation(this.getManagement(), this.object);
        },

        getTenantId: function()
        {
            return this.get("tenantId");
        },

        getObjectType: function()
        {
            return this.get("objectType");
        },

        getObjectId: function()
        {
            return this.get("objectId");
        }

    });

})(window);
