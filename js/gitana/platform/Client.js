(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Client = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Client.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Client
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Client"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CLIENT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/clients/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().client(this.getPlatform(), this);
        },

        /**
         * Gets the authorized grant types for the client
         */
        getAuthorizedGrantTypes: function()
        {
            return this.get("authorizedGrantTypes");
        },

        /**
         * Gets the scope for the client
         */
        getScope: function()
        {
            return this.get("scope");
        },

        /**
         * Gets the allow open driver authentication option for the client
         */
        getAllowOpenDriverAuthentication: function()
        {
            return this.get("allowOpenDriverAuthentication");
        },

        /**
         * Returns whether the client is enabled or not
         */
        getEnabled: function()
        {
            return this.get("enabled");
        }
    });

})(window);
