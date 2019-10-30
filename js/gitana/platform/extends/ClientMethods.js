(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.ClientMethods =
    {
        getKey: function()
        {
            return this.get("key");
        },

        getSecret: function()
        {
            return this.get("secret");
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
        },

        getAuthorizedGrantTypes: function()
        {
            return this.get("authorizedGrantTypes");
        },

        getScope: function()
        {
            return this.get("scope");
        },

        getRegisteredRedirectUri: function()
        {
            return this.get("registeredRedirectUri");
        },

        getAllowOpenDriverAuthentication: function()
        {
            return this.get("allowOpenDriverAuthentication");
        },

        getEnabled: function()
        {
            return this.get("enabled");
        },

        getAllowAutoApprovalForImplicitFlow: function()
        {
            return this.get("allowAutoApprovalForImplicitFlow");
        }
    };

})(window);
