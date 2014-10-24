(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractRepositoryObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractRepositoryObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Abstract base class for Gitana Node implementations.
         *
         * @param {Gitana.Branch} branch
         * @param {Object} [object]
         */
        constructor: function(repository, object)
        {
            this.base(repository.getPlatform(), object);


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
        },

        /**
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getRepositoryId() + "/" + this.getId();
        }

    });

})(window);
