/**
 * Repository functions
 */
(function(window) {
    var Gitana = window.Gitana;

    Gitana.Service.Changesets = function(repository) {

        // priviledged methods
        this.getDriver = function() { return repository.getDriver(); };
        this.getRepository = function() { return repository; };
        this.getRepositoryId = function() { return repository.getId(); };
    };

    /**
     * List
     *
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.list = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets", function(response) {

            var list = [];
            for each (row in response.rows) {
                list[list.length] = new Gitana.Object.Changeset(_this.getRepository(), row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler)
    };

    /**
     * Read
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.read = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var changesetId = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId, function(response) {

            callback(new Gitana.Object.Changeset(_this.getDriver(), response));

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Parents
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.parents = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
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
                list[list.length] = new Gitana.Object.Changeset(_this.getRepository(), row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Children
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.children = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
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
                list[list.length] = new Gitana.Object.Changeset(_this.getRepository(), row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Update
     *
     * @param changesetId
     * @param changesetObject
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.update = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var changesetId = args.shift();
        var changesetObject = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId, changesetObject, callback, Gitana.ajaxErrorHandler);
    };

})(window);
