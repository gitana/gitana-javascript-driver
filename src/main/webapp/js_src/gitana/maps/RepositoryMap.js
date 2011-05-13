(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.RepositoryMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.RepositoryMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of repository objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param {Object} object
         */
        constructor: function(server, object)
        {
            this.objectType = "Gitana.RepositoryMap";


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(server, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().repositoryMap(this.getServer(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().repository(this.getServer(), json);
        }

    });

})(window);
