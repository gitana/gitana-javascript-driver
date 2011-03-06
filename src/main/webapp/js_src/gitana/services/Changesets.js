(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Changesets Service
     */
    Gitana.Changesets = Gitana.AbstractService.extend(
    {
        constructor: function(repository)
        {
            this.base(repository.getDriver());

            // priviledged methods
            this.getRepository = function() { return repository; };
            this.getRepositoryId = function() { return repository.getId(); };
        },

        /**
         * List of changesets in the repository.
         *
         * @param callback (optional)
         */
        list: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Changeset(_this.getRepository(), row);
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
         * Read a changeset
         *
         * @param changesetId
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
            var changesetId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId, function(response) {

                if (callback)
                {
                    callback(new Gitana.Changeset(_this.getDriver(), response));
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Retrieve a list of parents for the given changeset
         *
         * @param changesetId
         * @param callback (optional)
         */
        parents: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var changesetId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId + "/parents", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Changeset(_this.getRepository(), row);
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
         * Retrieve a list of child changesets for the given changeset
         *
         * @param changesetId
         * @param callback (optional)
         */
        children: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var changesetId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId + "/children", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Changeset(_this.getRepository(), row);
                }
                response.list = list;

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        }

    });

})(window);
