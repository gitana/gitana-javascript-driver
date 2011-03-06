(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Repositories Service
     */
    Gitana.Repositories = Gitana.AbstractService.extend(
    {
        constructor: function(driver)
        {
            this.base(driver);
        },

        /**
         * Retrieve a list of repositories
         *
         * @param callback (optional)
         */
        list: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            // OPTIONAL: callback
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Repository(_this.getDriver(), row);
                }
                response.list = list;

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Read a repository
         *
         * @param repositoryId
         * @param callback (optional)
         */
        read: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED: repositoryId
            var repositoryId = args.shift();

            // OPTIONAL: callback
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + repositoryId, function(response) {

                if (callback)
                {
                    callback(new Gitana.Repository(_this.getDriver(), response));
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Create a repository
         */
        create: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            var repositoryObject = null;
            var callback = null;
            if (args.length == 1) {
                // ONE ARGUMENT - either "repositoryObject" or "callback"
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    repositoryObject = args.shift();
                }
            }
            else if (args.length == 2) {
                // TWO ARGUMENTS
                repositoryObject = args.shift();
                callable = args.shift();
            }

            // invoke
            this.getDriver().gitanaPost("/repositories", repositoryObject, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Delete a repository
         *
         * @param repositoryId
         * @param callback (optional)
         */
        del: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var repositoryId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaDelete("/repositories/" + repositoryId, function(response) {

                if (callback)
                {
                    callback(response);
                }
                
            }, this.ajaxErrorHandler);
        }

    });

})(window);
