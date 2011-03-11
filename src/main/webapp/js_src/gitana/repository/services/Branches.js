(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Branches service
     */
    Gitana.Branches = Gitana.AbstractService.extend(
    {
        constructor: function(repository)
        {
            this.base(repository.getDriver());

            this.getRepository = function() { return repository; };
            this.getRepositoryId = function() { return repository.getId(); };

        },

        /**
         * List the branches in a given repository
         *
         * @param callback (optional)
         */
        list: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Branch(_this.getRepository(), row);
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
         * Read a branch
         *
         * @param branchId
         * @param callback (optional)
         */
        read: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var branchId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + branchId, function(response) {

                if (callback)
                {
                    callback(new Gitana.Branch(_this.getRepository(), response));
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Create a branch
         *
         * @param changesetId
         * @param branchObject (optional)
         * @param callback (optional)
         */
        create: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var changesetId = args.shift();

            // OPTIONAL
            var branchObject = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    branchObject = args.shift();
                }
            }
            else if (args.length == 2) {
                branchObject = args.shift();
                callback = args.shift();
            }

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches?changeset=" + changesetId, branchObject, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        }

    });


})(window);
