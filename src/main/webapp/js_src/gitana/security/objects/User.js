(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.User = Gitana.Principal.extend(
    /** @lends Gitana.User.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
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
        },

        /**
         * Acquires the groups that contain this user.
         *
         * @public
         *
         * @param {Boolean} indirect whether the consider indirect groups
         * @param [Function] successCallback
         * @param [Function] failureCallback
         */
        getMemberships: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var indirect = false;
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
                indirect = a1;
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(response)
            {
                var list = [];

                for (var i = 0; i < response.rows.length; i++)
                {
                    list.push(new Gitana.User(_this.getDriver(), response.rows[i]));
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/security/users/" + _this.getPrincipalId() + "/memberships";
            if (indirect)
            {
                url = url + "?indirect=true";
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        }


    });

})(window);
