(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Group = Gitana.Principal.extend(
    /** @lends Gitana.Group.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Principal
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
         * Acquires a list of all of the members who are in this group.
         *
         * @public
         *
         * @param [String] filter type of principal to hand back ("user" or "group")
         * @param [Boolean] indirect whether to include members that inherit through child groups
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        listMembers: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var indirect = false;
            var filter = null;
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
                if (this.isString(a1))
                {
                    filter = a1;

                    var a2 = args.shift();
                    if (this.isFunction(a2))
                    {
                        successCallback = a2;
                        failureCallback = args.shift();
                    }
                    else
                    {
                        indirect = a2;
                        successCallback = args.shift();
                        failureCallback = args.shift();
                    }
                }
                else
                {
                    indirect = a1;
                    successCallback = args.shift();
                    failureCallback = args.shift();
                }
            }

            var onSuccess = function(response)
            {
                var list = [];
                for each (row in response.rows)
                {
                    if (row["principal-type"] == "user")
                    {
                        list[list.length] = new Gitana.User(_this.getDriver(), row);
                    }
                    else if (row["principal-type"] == "group")
                    {
                        list[list.length] = new Gitana.Group(_this.getDriver(), row);
                    }
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/security/groups/" + _this.getPrincipalId() + "/members?a=1";
            if (filter)
            {
                url = url + "&filter=" + filter;
            }
            if (indirect)
            {
                url = url + "&indirect=true";
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        },

        /**
         * Acquires a list of all of the users who are in this group.
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        listUsers: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            var a1 = args.shift();
            var a2 = args.shift();
            var a3 = args.shift();

            this.listMembers("user", a1, a2, a3);
        },

        /**
         * Acquires a list of all of the groups who are in this group.
         *
         * @public
         *
         * @param [Boolean] inherit whether to include members that inherit through child groups
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        listGroups: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            var a1 = args.shift();
            var a2 = args.shift();
            var a3 = args.shift();

            this.listMembers("group", a1, a2, a3);
        },

        /**
         * Adds a principal as a member of this group.
         *
         * @public
         *
         * @param {Object} principal the principal object
         * @param [Function] successCallback
         * @param [Function] failureCallback
         */
        addMember: function(principal, successCallback, failureCallback)
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

            this.getDriver().gitanaPost("/security/groups/" + this.getId() + "/add", principal, onSuccess, onFailure);
        },

        /**
         * Removes a principal as a member of this group.
         *
         * @public
         *
         * @param {Object} principal the principal object
         * @param [Function] successCallback
         * @param [Function] failureCallback
         */
        removeMember: function(principal, successCallback, failureCallback)
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
            this.getDriver().gitanaPost("/security/groups/" + this.getId() + "/remove", principal, onSuccess, onFailure);
        },

        /**
         * Acquires the groups that contain this group.
         *
         * @public
         *
         * @param {Boolean} indirect whether to consider indirect groups
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
                for each (row in response.rows)
                {
                    list[list.length] = new Gitana.Group(_this.getDriver(), row);
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/security/groups/" + _this.getPrincipalId() + "/memberships";
            if (indirect)
            {
                url = url + "?indirect=true";
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        }

    });

})(window);
