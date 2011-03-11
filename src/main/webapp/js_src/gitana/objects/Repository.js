(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Gitana Repository
     */
    Gitana.Repository = Gitana.AbstractGitanaObject.extend(
    {
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * Retrieves the branches API for this repository
         */
        branches: function()
        {
            return new Gitana.Branches(this);
        },

        /**
         * Retrieves the changesets API for this repository
         */
        changesets: function()
        {
            return new Gitana.Changesets(this);
        },

        /**
         * @Override
         */
        reload: function(callback)
        {
            var _this = this;

            this.getDriver().repositories().read(this.getId(), function(repository)
            {
                _this.replacePropertiesWith(repository);

                if (callback)
                {
                    callback(repository);
                }
            });
        },

        /**
         * Updates this repository
         *
         * @param callback
         */
        update: function(callback)
        {
            var args = this.makeArray(arguments);

            // OPTIONAL - callback
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaPut("/repositories/" + this.getId(), this, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Deletes this repository.
         *
         * @param callback
         */
        del: function(callback)
        {
            this.getDriver().repositories().del(this.getId(), callback);
        }

    });

})(window);
