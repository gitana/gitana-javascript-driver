(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Repositories = Gitana.AbstractService.extend(
    /** @lends Gitana.Repositories.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractService
         *
         * @class Repositories Service
         *
         * @param {Gitana.Driver} driver The Gitana driver for this service
         */
        constructor: function(driver)
        {
            this.base(driver);
        },

        /**
         * Acquires a list of all repositories
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        list: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var list = [];

                for (var i = 0; i < response.rows.length; i++)
                {
                    list.push(new Gitana.Repository(_this.getDriver(), response.rows[i]));
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories", onSuccess, onFailure);
        },

        /**
         * Read a repository
         *
         * @param {String} repositoryId the repository id
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(repositoryId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(obj)
            {
                successCallback(new Gitana.Repository(_this.getDriver(), obj));
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + repositoryId, onSuccess, onFailure);
        },

        /**
         * Create a repository
         *
         * @param [Object] object JSON object
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var object = null;
            var successCallback = null;
            var failureCallback = null;

            var a1 = args.shift();
            if (this.isFunction(a1))
            {
                successCallback = a1;
                failureCallback = args.shift();
            }
            else
            {
                object = a1;
                successCallback = args.shift();
                failureCallback = args.shift();
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
            this.getDriver().gitanaPost("/repositories", object, onSuccess, onFailure);
        },

        /**
         * Delete a repository
         *
         * @param {String} repositoryId
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        del: function(repositoryId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaDelete("/repositories/" + repositoryId, onSuccess, onFailure);
        },

        /**
         * Query for a repository
         *
         * @param {Object} queryObj Query for finding a repository.
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        query: function(queryObj, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/query",queryObj, onSuccess, onFailure);
        }

    });

})(window);
