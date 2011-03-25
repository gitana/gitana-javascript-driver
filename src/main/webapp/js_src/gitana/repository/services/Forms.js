(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Forms = Gitana.AbstractNodeService.extend(
    /** @lends Gitana.Forms.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNodeService
         *
         * @class Forms Service
         *
         * @param {Gitana.Node} node The Gitana Node to which this service is constrained.
         */
        constructor: function(node)
        {
            this.base(node);
        },

        /**
         * Acquires a list of associations of type "a:has_form" for this definition.
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        list: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getNode().getId() + "/forms";
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        },

        /**
         * Reads a form by form key that is associated to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(formKey, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/forms/" + formKey, onSuccess, onFailure);
        },

        /**
         * Creates a form and associates it to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         * @param [Object] object the object that constitutes the form
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var formKey = args.shift();
            var object = {};
            var successCallback = null;
            var failureCallback = null;
            if (args.length == 1)
            {
                successCallback = args.shift();
            }
            else if (args.length == 2)
            {
                object = args.shift();
                successCallback = args.shift();
            }
            else if (args.length == 3)
            {
                object = args.shift();
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(form)
            {
                successCallback(form);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // default properties on object
            object["_type"] = "n:form";

            // now do all the work
            _this.getBranch().nodes().create(object, function(status) {
                _this.getBranch().nodes().read(status.getId(), function(form) {

                    // associate the form (type = "a:has_form")
                    _this.getNode().associate(form.getId(), "a:has_form", function(status) {
                        _this.getBranch().nodes().read(status.getId(), function(association) {

                            // update the association with form key
                            association["form-key"] = formKey;
                            association.update(function(status) {

                                onSuccess.call(this, form);

                            }, onFailure)

                        }, onFailure);
                    }, onFailure);
                }, onFailure);
            }, onFailure);
        },

        /**
         * Convenience function to remove a form linked to this definition.
         * Note: This doesn't delete the form, it simply unlinks the association.
         *
         * @public
         * 
         * @param {String} formKey the form key
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        remove: function(formKey, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // find the form association
            _this.read(formKey, function(association)
            {
                // delete the association
                association.del(function(status) {

                    onSuccess.call(_this, status);

                }, onFailure);
            }, onFailure);
        }
    });

})(window);
