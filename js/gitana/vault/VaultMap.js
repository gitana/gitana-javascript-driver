(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.VaultMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.VaultMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class VaultMap
         *
         * @param {Gitana.Platform} platform Gitana platform
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.VaultMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().vaultMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().vault(this.getPlatform(), json);
        }

    });

})(window);
