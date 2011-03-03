/**
 * Repository functions
 */
(function(window) {
    var Gitana = window.Gitana;

    Gitana.Service.Nodes = function(branch) {

        // priviledged methods
        this.getDriver = function() { return branch.getRepository().getDriver(); };
        this.getRepository = function() { return branch.getRepository(); };
        this.getRepositoryId = function() { return branch.getRepository().getId(); };
        this.getBranch = function() { return branch; };
        this.getBranchId = function() { return branch.getId(); };
    };

    /**
     * List
     *
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.list = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", function(response) {

            var list = [];
            for each (row in response.rows) {
                list[list.length] = new Gitana.Object.Node(_this.getBranch(), row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler)
    };

    /**
     * Read
     *
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.read = function() {
        var _this = this;

        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var nodeId = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, function(response) {

            callback(new Gitana.Object.Node(_this.getBranch(), response));

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Create
     *
     * @param nodeObject (optional)
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.create = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // OPTIONAL
        var nodeObject = null;
        var callback = null;
        if (args.length == 1) {
            if (!Gitana.isFunction(args[0])) {
                nodeObject = args.shift();
            }
            else {
                callback = args.shift();
            }
        }
        else if (args.length == 2) {
            nodeObject = args.shift();
            callback = args.shift();
        }

        // invoke
        this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", nodeObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Updates a node
     *
     * @param nodeId
     * @param nodeObject
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.update = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var nodeId = args.shift();
        var nodeObject = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, nodeObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Delete
     *
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.del = function() {
        var args = Gitana.makeArray(arguments);
        if (args.length == 0) {
            // TODO: error
        }

        // REQUIRED
        var nodeId = args.shift();

        // OPTIONAL
        var callback = args.shift();

        // invoke
        this.getDriver().gitanaDelete("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, callback, Gitana.ajaxErrorHandler);
    };

})(window);
