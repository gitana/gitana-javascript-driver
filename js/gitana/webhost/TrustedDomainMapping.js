(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.TrustedDomainMapping = Gitana.AbstractWebHostObject.extend(
    /** @lends Gitana.TrustedDomainMapping.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractWebHostObject
         *
         * @class TrustedDomainMapping
         *
         * @param {Gitana.WebHost} webhost
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(webhost, object)
        {
            this.base(webhost, object);

            this.objectType = function() { return "Gitana.TrustedDomainMapping"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().trustedDomainMapping(this.getWebHost(), this);
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
