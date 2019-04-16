(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AuthenticationGrantMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.AuthenticationGrantMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of authentication grants
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param {Object} object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.AuthenticationGrantMap"; };


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
            return this.getFactory().authenticationGrantMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().authenticationGrant(this.getPlatform(), json);
        }

    });

})(window);
