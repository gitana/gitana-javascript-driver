(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Definitions Service
     */
    Gitana.Definitions = Gitana.AbstractBranchService.extend(
    {
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

                response.list = _this.buildList(response.rows);

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

                var node = _this.build(response);
                if (callback)
                {
                    callback(node);
                }

            }, this.ajaxErrorHandler);
        }


    });

})(window);
