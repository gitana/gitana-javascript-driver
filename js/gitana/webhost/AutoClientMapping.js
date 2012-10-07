(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AutoClientMapping = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AutoClientMapping.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AutoClientMapping
         *
         * @param {Gitana.WebHost} webhost
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost.getPlatform(), object);

            this.objectType = function() { return "Gitana.AutoClientMapping"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Web Host object.
             *
             * @inner
             *
             * @returns {Gitana.WebHost} The Gitana Web Host object
             */
            this.getWebHost = function() { return webhost; };

            /**
             * Gets the Gitana Web Host id.
             *
             * @inner
             *
             * @returns {String} The Gitana Web Host id
             */
            this.getWebHostId = function() { return webhost.getId(); };
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
