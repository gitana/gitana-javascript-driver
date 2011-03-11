(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Branch
     */
    Gitana.Branch = Gitana.AbstractGitanaObject.extend(
    {
        constructor: function(repository, object)
        {
            this.base(repository.getDriver(), object);

            // priviledged methods
            this.getRepository = function() { return repository; };
            this.getRepositoryId = function() { return repository.getId(); };
        },

        /**
         * Gets the nodes API for this branch
         */
        nodes: function()
        {
            return new Gitana.Nodes(this);
        },

        /**
         * Gets the definitions API for this branch
         */
        definitions: function()
        {
            return new Gitana.Definitions(this);
        },

        /**
         * @Override
         */
        reload: function(callback)
        {
            var _this = this;

            this.getRepository().branches().read(this.getId(), function(branch)
            {
                _this.replacePropertiesWith(branch);

                if (callback)
                {
                    callback(branch);
                }
            });
        },

        /**
         * Updates this branch.
         *
         * @param callback optional method
         */
        update: function(callback)
        {
            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId(), this, function(response) {

                if (callback)
                {
                    callback(response);
                }
                
            }, this.ajaxErrorHandler);
        }

    });

})(window);
