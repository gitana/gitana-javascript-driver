(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ReleaseMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ReleaseMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of release objects
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object
         */
        constructor: function(repository, object)
        {
            this.objectType = function() { return "Gitana.ReleaseMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(repository.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().releaseMap(this.getRepository(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().release(this.getRepository(), json);
        }

    });

})(window);
