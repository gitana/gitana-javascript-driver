(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Translations = Gitana.AbstractNodeService.extend(
    /** @lends Gitana.Translations.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNodeService
         *
         * @class Translations Service
         *
         * @param {Gitana.Node} node The Gitana Node to which this service is constrained.
         */
        constructor: function(node)
        {
            this.base(node);
        },

        /**
         * Creates a new translation.
         *
         * @param {String} edition the edition of the translation (can be any string)
         * @param {String} locale the locale string for the translation (i.e. "en_US")
         * @param [Object] object JSON object
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var edition = null;
            var locale = null;
            var object = {};
            var successCallback = null;
            var failureCallback = null;
            if (args.length == 2)
            {
                edition = args.shift();
                locale = args.shift();
            }
            else if (args.length >= 3)
            {
                edition = args.shift();
                locale = args.shift();

                var a3 = args.shift();
                var a4 = args.shift();
                var a5 = args.shift();

                if (this.isFunction(a3))
                {
                    successCallback = a3;
                    failureCallback = a4;
                }
                else
                {
                    object = a3;
                    successCallback = a4;
                    failureCallback = a5;
                }
            }

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions/" + edition + "/locales/" + locale;
            this.getDriver().gitanaPost(url, object, onSuccess, onFailure);
        },

        /**
         * Lists all of the editions for this master node.
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        editions: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response["editions"]);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions", onSuccess, onFailure);
        },

        /**
         * Lists all of the locales for the given edition of this master node.
         *
         * @param {String} edition the edition
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        locales: function(edition, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response["locales"]);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/editions/" + edition + "/locales", onSuccess, onFailure);
        },

        /**
         * Translates the node into the given locale.  The tip edition is used from the master node.
         *
         * @param [String] edition The edition of the translation to use.  If not provided, the tip edition is used from the master node.
         * @param {String} locale The locale to translate into.
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        translate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var edition = null;
            var locale = null;
            var successCallback = null;
            var failureCallback = null;
            if (args.length == 1)
            {
                locale = args.shift();
            }
            else if (args.length >= 2)
            {
                var a1 = args.shift();
                var a2 = args.shift();

                if (this.isString(a1) && this.isString(a2))
                {
                    edition = a1;
                    locale = a2;
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
                else if (this.isString(a1) && this.isFunction(a2))
                {
                    locale = a1;
                    successCallback = a2;
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

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
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        }

    });

})(window);
