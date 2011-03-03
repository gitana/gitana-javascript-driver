/**
 * Repository functions
 */
(function(window) {
    var Gitana = window.Gitana;

    Gitana.Service.Branches = function(repository) {

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
    Gitana.Service.Branches.prototype.list = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches", function(response) {

            var list = [];
            for each (row in response.rows) {
                list[list.length] = new Gitana.Object.Branch(_this.getRepository(), row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Read
     *
     * @param branchId
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.read = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var branchId = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + branchId, function(response) {

            callback(new Gitana.Object.Branch(_this.getRepository(), response));

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Create
     *
     * @param changesetId
     * @param branchObject (optional)
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.create = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var changesetId = args.shift();

        // OPTIONAL
        var branchObject = null;
        var callback = null;
        if (args.length == 1) {
            if (Gitana.isFunction(args[0])) {
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
        this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches?changeset=" + changesetId, branchObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Update
     *
     * @param branchId
     * @param branchObject
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.update = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var branchId = args.shift();
        var branchObject = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + branchId, branchObject, callback, Gitana.ajaxErrorHandler);
    };


})(window);
