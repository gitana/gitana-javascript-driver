(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractRepositoryService = Gitana.AbstractService.extend(
    /** @lends Gitana.AbstractRepositoryService.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractService
         *
         * @class Abstract base class for a repository service.
         *
         * @param {Gitana.Repository} repository The repository to which the service should be constrained.
         */
        constructor: function(repository)
        {
            this.base(repository.getDriver());

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
        }

    });

})(window);
