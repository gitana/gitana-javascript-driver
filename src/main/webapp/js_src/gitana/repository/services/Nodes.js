(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Nodes Service
     */
    Gitana.Nodes = Gitana.AbstractBranchService.extend(
    {
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

                response.list = _this.buildList(response.rows);

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

                var node = _this.build(response);
                if (callback)
                {
                    callback(node);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Create a node
         *
         * @param object (optional)
         * @param callback (optional)
         */
        create: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // OPTIONAL
            var object = null;
            var callback = null;
            if (args.length == 1) {
                if (!this.isFunction(args[0])) {
                    object = args.shift();
                }
                else {
                    callback = args.shift();
                }
            }
            else if (args.length == 2) {
                object = args.shift();
                callback = args.shift();
            }

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes", object, function(response) {

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
