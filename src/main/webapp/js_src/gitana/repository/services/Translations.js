(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Convenience functions for working with translations
     */
    Gitana.Translations = Gitana.AbstractNodeService.extend(
    {
        /**
         * Creates a new translation.
         *
         * @param edition
         * @param locale
         * @param object (optional)
         * @param callback (optional)
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var edition = args.shift();
            var locale = args.shift();

            // OPTIONAL
            var object = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    object = args.shift();
                }
            }
            else if (args.length == 2) {
                object = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions/" + edition + "/locales/" + locale;
            this.getDriver().gitanaPost(url, object, function(response) {

                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);

        },

        /**
         * Lists all of the editions for this master node.
         *
         * @param callback (optional)
         */
        editions: function()
        {
            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions", function(response)
            {
                if (callback)
                {
                    callback(response["editions"]);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * All of the locales for the given edition.
         *
         * @param edition
         * @param callback (optional)
         */
        locales: function()
        {
            var args = this.makeArray(arguments);

            // REQUIRED
            var edition = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions/" + edition + "/locales", function(response)
            {
                if (callback)
                {
                    callback(response["locales"]);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Translates the node into the given locale.  The tip edition is used from the master node.
         *
         * @param edition (optional)
         * @param locale
         * @param callback (optional)
         */
        translate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // PARAMETERS
            var edition = null;
            var locale = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    locale = args.shift();
                }
            }
            else if (args.length == 2) {
                if (this.isFunction(args[1])) {
                    locale = args.shift();
                    callback = args.shift();
                }
                else {
                    edition = args.shift();
                    locale = args.shift();
                }
            }
            else if (args.length == 3) {
                edition = args.shift();
                locale = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = null;
            if (edition)
            {
                url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/translate/" + edition + "/" + locale;
            }
            else
            {
                url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/translate/" + locale;
            }
            this.getDriver().gitanaGet(url, function(response)
            {
                var node = _this.build(response);
                if (callback)
                {
                    callback(node);
                }

            }, this.ajaxErrorHandler);
        }

    });

})(window);
