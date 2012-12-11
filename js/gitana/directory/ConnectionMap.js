(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ConnectionMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ConnectionMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of connection objects
         *
         * @param {Gitana.Registrar} directory Gitana directory object
         * @param {Object} object
         */
        constructor: function(directory, object)
        {
            this.objectType = function() { return "Gitana.ConnectionMap"; };


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
            return this.getFactory().connectionMap(this.getDirectory(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().connection(this.getDirectory(), json);
        }

    });

})(window);
