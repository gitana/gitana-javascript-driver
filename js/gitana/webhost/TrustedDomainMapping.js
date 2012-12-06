(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.TrustedDomainMapping = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.TrustedDomainMapping.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class TrustedDomainMapping
         *
         * @param {Gitana.WebHost} webhost
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost.getPlatform(), object);

            this.objectType = function() { return "Gitana.TrustedDomainMapping"; };


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
            return Gitana.TypedIDConstants.TYPE_TRUSTED_DOMAIN_MAPPING;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/webhosts/" + this.getWebHostId() + "/trusteddomainmappings/" + this.getId();
        }
    });

})(window);
