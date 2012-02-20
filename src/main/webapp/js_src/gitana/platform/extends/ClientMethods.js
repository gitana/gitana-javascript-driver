(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ClientMethods =
    {
        getAuthType: function()
        {
            return this.get("authType");
        },

        getKey: function()
        {
            return this.get("key");
        },

        getSecret: function()
        {
            return this.get("secret");
        },

        getAuthorizedGrantTypes: function()
        {
            return this.get("authorizedGrantTypes")
        },

        getScope: function()
        {
            return this.get("scope");
        },

        getRegisteredRedirectUri: function()
        {
            return this.get("registeredRedirectUri");
        },

        getDomainUrls: function()
        {
            return this.get("domainUrls");
        },

        getIsTenantDefault: function()
        {
            return this.get("isTenantDefault");
        },

        getDefaultTenantId: function()
        {
            return this.get("defaultTenantId");
        }
    };

})(window);
