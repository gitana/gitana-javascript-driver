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

            // build method to assist with constructing node wrapper objects
            this.build = function(object)
            {
                return this.getDriver().nodeFactory().produce(this, object);
            };
            this.buildList = function(array)
            {
                return this.getDriver().nodeFactory().list(this, array);
            };
            this.buildMap = function(array)
            {
                return this.getDriver().nodeFactory().map(this, array);
            };

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
         * Gets the branch helper function API
         */
        helpers: function()
        {
            return new Gitana.BranchHelpers(this);
        },

        /**
         * @Override
         */
        reload: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

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
        update: function()
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
        },

        /**
         * Searches the branch.
         *
         * Config should be:
         *
         *    {
         *       "search": {
         *           ... Elastic Search Config Block
         *       }
         *    }
         *
         * For a full text term search, you can simply provide text in place of a config json object.
         *
         * See the Elastic Search documentation for more advanced examples
         *
         * @param config
         * @param successCallback
         * @param failureCallback
         */
        search: function()
        {
            var _this = this;
            
            var args = this.makeArray(arguments);

            // REQUIRED
            var config = args.shift();

            // OPTIONAL
            var successCallback = args.shift();
            var failureCallback = args.shift();
            if (!failureCallback)
            {
                failureCallback = this.ajaxErrorHandler;
            }

            // support for simplified full-text search configuration
            if (this.isString(config))
            {
                config = { "search": config };
            }

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getId() + "/search", config, function(response) {

                response.list = _this.buildList(response.rows);

                if (successCallback)
                {
                    successCallback(response);
                }

            }, failureCallback);

        }

    });

})(window);
