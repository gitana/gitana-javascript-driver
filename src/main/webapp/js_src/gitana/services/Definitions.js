(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Definitions Service
     */
    Gitana.Definitions = Gitana.AbstractService.extend(
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
         * List of definitions
         *
         * @param filter (optional) ["association", "type" or "feature"]
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
            var filter = null;
            var callback = null;
            if (args.length == 1) {
                if (!this.isFunction(args[0])) {
                    filter = args.shift();
                }
                else {
                    callback = args.shift();
                }
            }
            else if (args.length == 2) {
                filter = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/definitions";
            if (filter)
            {
                url = url + "?filter=" + filter;
            }
            this.getDriver().gitanaGet(url, function(response) {

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
         * Reads a definition by qname.
         *
         * @param qname
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
            var qname = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/definitions/" + qname, function(response) {

                if (callback)
                {
                    callback(new Gitana.Node(_this.getBranch(), response));
                }

            }, this.ajaxErrorHandler);
        }


    });

})(window);
