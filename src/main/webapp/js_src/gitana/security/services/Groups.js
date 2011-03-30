(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Groups = Gitana.AbstractService.extend(
    /** @lends Gitana.Groups.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractService
         *
         * @class Groups Service
         *
         * @param {Gitana.Driver} driver The Gitana driver for this service
         */
        constructor: function(driver)
        {
            this.base(driver);
        },

        /**
         * Acquires a list of all groups.
         *
         * Note: This is potentially a very expensive call and may be deprecated in the future.
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
                    list[list.length] = new Gitana.Group(_this.getDriver(), row);
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/security/groups", onSuccess, onFailure);
        },

        /**
         * Reads a group
         *
         * @param {String} groupId the group id
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(groupId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(obj)
            {
                successCallback(new Gitana.Group(_this.getDriver(), obj));
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/security/groups/" + groupId, onSuccess, onFailure);
        },

        /**
         * Create a group.
         *
         * Note: The field "groupId" must be present on the json object.
         *
         * @param {Object} object JSON object
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        create: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var object = args.shift();
            var successCallback = args.shift();
            var failureCallback = args.shift();

            var onSuccess = function(response)
            {
                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/security/groups/", object, onSuccess, onFailure);
        },

        /**
         * Delete a group
         *
         * @param {String} groupId
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        del: function(groupId, successCallback, failureCallback)
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
            this.getDriver().gitanaDelete("/security/groups/" + groupId, onSuccess, onFailure);
        }

    });

})(window);
