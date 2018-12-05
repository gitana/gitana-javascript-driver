(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AutoClientMapping = Gitana.AbstractWebHostObject.extend(
    /** @lends Gitana.AutoClientMapping.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWebHostObject
         *
         * @class AutoClientMapping
         *
         * @param {Gitana.WebHost} webhost
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost, object);

            this.objectType = function() { return "Gitana.AutoClientMapping"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().autoClientMapping(this.getWebHost(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_AUTO_CLIENT_MAPPING;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/webhosts/" + this.getWebHostId() + "/autoclientmappings/" + this.getId();
        },

        getSourceUri: function()
        {
            return this.get("uri");
        },

        getTargetApplicationId: function()
        {
            return this.get("applicationId");
        },

        getTargetApplicationKey: function()
        {
            return this.get("applicationKey");
        },

        getTargetClientKey: function()
        {
            return this.get("clientKey");
        },

        getTargetTenantId: function()
        {
            return this.get("tenantId");
        },

        getAutoManage: function()
        {
            return this.get("automanage");
        }
    });

})(window);
