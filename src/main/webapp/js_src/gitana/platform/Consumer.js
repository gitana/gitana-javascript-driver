(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Consumer = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Consumer.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Consumer
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Consumer";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/consumers/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().consumer(this.getPlatform(), this.object);
        },


        //////////////////////
        // CONSUMER OPERATIONS
        //////////////////////

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

        getDomainUrls: function()
        {
            return this.get("domainUrls");
        },

        getAllowTicketAuthentication: function()
        {
            return this.get("allowTicketAuthentication");
        },

        getAllowOpenDriverAuthentication: function()
        {
            return this.get("allowOpenDriverAuthentication");
        },

        getIsTenantDefault: function()
        {
            return this.get("isTenantDefault");
        },

        getDefaultTenantId: function()
        {
            return this.get("defaultTenantId");
        }

    });

})(window);
