(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Nodes Service
     */
    Gitana.Nodes = Gitana.AbstractService.extend(
    {
        constructor: function(branch)
        {
            this.base(branch.getDriver());

            // priviledged methods
            this.getRepository = function() { return branch.getRepository(); };
            this.getRepositoryId = function() { return branch.getRepository().getId(); };
            this.getBranch = function() { return branch; };
            this.getBranchId = function() { return branch.getId(); };
        },

        /**
         * List of root nodes
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
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", function(response) {

                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Node(_this.getBranch(), row);
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
         * Reads a node.
         *
         * @param nodeId
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
            var nodeId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, function(response) {

                if (callback)
                {
                    callback(new Gitana.Node(_this.getBranch(), response));
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Create a node
         *
         * @param nodeObject (optional)
         * @param callback (optional)
         */
        create: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // OPTIONAL
            var nodeObject = null;
            var callback = null;
            if (args.length == 1) {
                if (!this.isFunction(args[0])) {
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
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", nodeObject, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Delete a node
         *
         * @param nodeId
         * @param callback (optional)
         */
        del: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var nodeId = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaDelete("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + nodeId, function(response) {

                if (callback)
                {
                    callback(response);
                }
                
            }, this.ajaxErrorHandler);
        }

    });

})(window);
