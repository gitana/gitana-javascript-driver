(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Changeset
     */
    Gitana.Changeset = Gitana.AbstractGitanaObject.extend(
    {
        constructor: function(repository, object)
        {
            this.base(repository.getDriver(), object);

            // priviledged methods
            this.getRepository = function() { return repository; };
            this.getRepositoryId = function() { return repository.getId(); };
        },

        /**
         * @Override
         */
        reload: function(callback)
        {
            var _this = this;

            this.getRepository().changesets().read(this.getId(), function(changeset)
            {
                _this.replacePropertiesWith(changeset);

                if (callback)
                {
                    callback(changeset);
                }
            });
        },

        /**
         * Update the changeset.
         *
         * @param callback
         */
        update: function(callback)
        {
            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId(), this, function(response) {

                if (callback)
                {
                    callback(response);
                }
                
            }, this.ajaxErrorHandler);
        }

    });

})(window);
