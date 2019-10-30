(function(window)
{
    const  Gitana = window.Gitana;
    
    Gitana.IdentityMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.IdentityMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of identity objects
         *
         * @param {Gitana.Registrar} directory Gitana directory object
         * @param {Object} object
         */
        constructor: function(directory, object)
        {
            this.objectType = function() { return "Gitana.IdentityMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getDirectory = function()
            {
                return directory;
            };

            this.getDirectoryId = function()
            {
                return directory.getId();
            };

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(directory.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().identityMap(this.getDirectory(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().identity(this.getDirectory(), json);
        }

    });

})(window);
