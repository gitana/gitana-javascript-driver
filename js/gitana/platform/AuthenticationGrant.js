(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AuthenticationGrant = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AuthenticationGrant.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AuthenticationGrant
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.AuthenticationGrant"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_AUTHENTICATION_GRANT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/auth/grants/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().authenticationGrant(this.getPlatform(), this);
        },


        ///////////////////////////////
        // AUTH GRANT OPERATIONS
        ///////////////////////////////

        getKey: function()
        {
            return this.get("key");
        },

        getSecret: function()
        {
            return this.get("secret");
        },

        getPrincipalDomainId: function()
        {
            return this.get("principalDomainId");
        },

        getPrincipalId: function()
        {
            return this.get("principalId");
        },

        getClientId: function()
        {
            return this.get("clientId");
        },

        getEnabled: function()
        {
            return this.get("enabled");
        },

        getAllowOpenDriverAuthentication: function()
        {
            return this.get("allowOpenDriverAuthentication");
        }

    });

})(window);
