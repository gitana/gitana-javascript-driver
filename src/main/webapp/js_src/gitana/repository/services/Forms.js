(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Forms Service
     */
    Gitana.Forms = Gitana.AbstractNodeService.extend(
    {
        /**
         * Hands back a list of form associations for the current node.
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
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getNode().getId() + "/forms";
            this.getDriver().gitanaGet(url, function(response)
            {
                response.list = _this.buildList(response.rows);

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Reads a form by form key.
         *
         * @param formKey
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
            var formKey = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/forms/" + formKey, function(response) {

                var node = _this.build(response);
                if (callback)
                {
                    callback(node);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Convenience function to create a form linked to this definition.
         *
         * @param formKey
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
            var formKey = args.shift();

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

            // create the form
            if (!object)
            {
                object = {};
            }
            object["_type"] = "n:form";
            _this.getBranch().nodes().create(object, function(status) {
                _this.getBranch().nodes().read(status.getId(), function(form) {

                    // associate the form (type = "a:has_form")
                    _this.getNode().associate(form.getId(), "a:has_form", function(status) {
                        _this.getBranch().nodes().read(status.getId(), function(association) {

                            // update the association with form key
                            association["form-key"] = formKey;
                            association.update(function(status) {

                                if (callback)
                                {
                                    callback(form);
                                }
                            })

                        });
                    });
                });
            });
        },

        /**
         * Convenience function to remove a form linked to this definition.
         * Note: This doesn't delete the form, it simply unlinks the association.
         *
         * @param formKey
         * @param callback (optional)
         */
        remove: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var formKey = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // find the form association
            _this.read(formKey, function(association)
            {
                // delete the association
                association.del(function(status) {

                    if (callback)
                    {
                        callback(status);
                    }
                });
            });
        }
    });

})(window);
