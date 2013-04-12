(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AuthInfo = Base.extend(
    /** @lends Gitana.AuthInfo.prototype */
    {
        /**
         * @constructs
         *
         * @class Gitana.AuthInfo holds authentication info for the driver
         *
         * @param {Object} object json response object
         */
        constructor: function(object)
        {
            Gitana.copyInto(this, object);
        },

        getPrincipalId: function()
        {
            return this["principalId"];
        },

        getPrincipalDomainId: function()
        {
            return this["principalDomainId"];
        },

        getPrincipalName: function()
        {
            return this["principalName"];
        },

        getTenantId: function()
        {
            return this["tenantId"];
        },

        getTenantTitle: function()
        {
            return this["tenantTitle"];
        },

        getTenantDescription: function()
        {
            return this["tenantDescription"];
        },

        getClientId: function()
        {
            return this["clientId"];
        },

        getTicket: function()
        {
            return this["ticket"];
        }
    });

})(window);
