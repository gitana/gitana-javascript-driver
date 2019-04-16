(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.PrincipalMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.PrincipalMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of principal objects
         *
         * @param {Gitana.Domain} domain Gitana domain instance.
         * @param {Object} object
         */
        constructor: function(domain, object)
        {
            this.objectType = function() { return "Gitana.PrincipalMap"; };

            this.getDomain = function()
            {
                return domain;
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(domain.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().domainPrincipalMap(this.getDomain(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().domainPrincipal(this.getDomain(), json);
        }

    });

})(window);
