(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.MergeConflictMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.MergeConflictMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of merge conflict objects
         *
         * @param {Gitana.Repository} repository
         * @param {Object} object
         */
        constructor: function(repository, object)
        {
            this.objectType = function() { return "Gitana.MergeConflictMap"; };


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
            return this.getFactory().mergeConflictMap(this.getRepository(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().mergeConflict(this.getRepository(), json);
        }

    });

})(window);
