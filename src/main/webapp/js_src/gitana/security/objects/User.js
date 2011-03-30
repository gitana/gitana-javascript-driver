(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.User = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.User.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class User
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

            var onSuccess = function(user)
            {
                _this.replacePropertiesWith(user);

                if (successCallback)
                {
                    successCallback(user);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getDriver().users().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Updates this user
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
            this.getDriver().gitanaPut("/security/users/" + this.getId(), this, onSuccess, onFailure);
        },

        /**
         * Deletes this user.
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

            this.getDriver().users().del(this.getId(), onSuccess, onFailure);
        }

    });

})(window);
