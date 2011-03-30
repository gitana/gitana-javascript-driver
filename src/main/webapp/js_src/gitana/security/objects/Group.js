(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Group = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.Group.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Group
         *
         * @param {Gitana.Driver} driver Gitana driver 
         * @param {Object} object the JSON object
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * @Override
         */
        reload: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(group)
            {
                _this.replacePropertiesWith(group);

                if (successCallback)
                {
                    successCallback(group);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getDriver().groups().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Updates this group
         *
         * @public
         *
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        update: function(successCallback, failureCallback)
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
            this.getDriver().gitanaPut("/security/groups/" + this.getId(), this, onSuccess, onFailure);
        },

        /**
         * Deletes this group
         *
         * @public
         * 
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        del: function(successCallback, failureCallback)
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

            this.getDriver().groups().del(this.getId(), onSuccess, onFailure);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        getUserMembers: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var list = [];
                for each (row in response.rows) {
                    list[list.length] = new Gitana.User(_this.getDriver(), row);
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/security/groups/" + _this.getId() + "/users", onSuccess, onFailure);
        },

        /**
         * Adds a user as a member of this group.
         *
         * @public
         *
         * @param userId user id
         * @param successCallback
         * @param failureCallback
         */
        addUserMember: function(userId, successCallback, failureCallback)
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
            this.getDriver().gitanaPut("/security/groups/" + this.getId() + "/users/" + userId, {}, onSuccess, onFailure);
        },

        /**
         * Removes a user as a member of this group.
         *
         * @public
         *
         * @param userId user id
         * @param successCallback
         * @param failureCallback
         */
        removeUserMember: function(userId, successCallback, failureCallback)
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
            this.getDriver().gitanaDelete("/security/groups/" + this.getId() + "/users/" + userId, onSuccess, onFailure);
        },

        /**
         * Acquires a list of all of the groups who are in this group.
         *
         * @public
         *
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        getGroupMembers: function(successCallback, failureCallback)
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
            this.getDriver().gitanaGet("/security/groups/" + _this.getId() + "/groups", onSuccess, onFailure);
        },

        /**
         * Adds a sub-group as a member of this group.
         *
         * @public
         *
         * @param groupId group id
         * @param successCallback
         * @param failureCallback
         */
        addGroupMember: function(groupId, successCallback, failureCallback)
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
            this.getDriver().gitanaPut("/security/groups/" + this.getId() + "/groups/" + groupId, {}, onSuccess, onFailure);
        },

        /**
         * Removes a group as a member of this group.
         *
         * @public
         *
         * @param groupId group id
         * @param successCallback
         * @param failureCallback
         */
        removeGroupMember: function(groupId, successCallback, failureCallback)
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
            this.getDriver().gitanaDelete("/security/groups/" + this.getId() + "/groups/" + groupId, onSuccess, onFailure);
        }

    });

})(window);
