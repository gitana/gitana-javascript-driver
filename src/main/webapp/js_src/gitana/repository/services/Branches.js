(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Branches = Gitana.AbstractRepositoryService.extend(
    /** @lends Gitana.Branches.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryService
         *
         * @class Branches Service
         *
         * @param {Gitana.Repository} repository The Gitana Repository object for this service.
         */
        constructor: function(repository)
        {
            this.base(repository);
        },

        /**
         * List the branches in a given repository
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
                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.Branch(_this.getRepository(), row);
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches", onSuccess, onFailure);
        },

        /**
         * Reads a branch.
         *
         * @public
         *
         * @param {String} branchId the branch id
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(branchId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(obj)
            {
                successCallback(new Gitana.Branch(_this.getRepository(), obj));
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + branchId, onSuccess, onFailure);
        },

        /**
         * Creates a branch.
         *
         * @public
         *
         * @param {String} changesetId the changeset id where the new branch should be rooted.
         * @param [Object] object JSON object for the branch
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var changesetId = args.shift();
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

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches?changeset=" + changesetId, object, onSuccess, onFailure);
        }
        
    });


})(window);
