(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Repository = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.Repository.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Repository
         *
         * @param {Gitana.Driver} driver Gitana driver 
         * @param {Object} object the JSON object
         */
        constructor: function(driver, object)
        {
            this.base(driver, object);
        },

        /**
         * Retrieves the branches API for this repository
         *
         * @public
         *
         * @returns {Gitana.Branches} Branches API
         */
        branches: function()
        {
            return new Gitana.Branches(this);
        },

        /**
         * Retrieves the changesets API for this repository
         *
         * @public
         *
         * @returns {Gitana.Changesets} Changesets API
         */
        changesets: function()
        {
            return new Gitana.Changesets(this);
        },

        /**
         * @Override
         */
        reload: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(repository)
            {
                _this.replacePropertiesWith(repository);

                if (successCallback)
                {
                    successCallback(repository);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getDriver().repositories().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Updates this repository
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
            this.getDriver().gitanaPut("/repositories/" + this.getId(), this, onSuccess, onFailure);
        },

        /**
         * Deletes this repository.
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

            this.getDriver().repositories().del(this.getId(), onSuccess, onFailure);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Retrieves the full ACL list.
         *
         * @param {Function} successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        lookupACL: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaGet("/repositories/" + this.getId() + "/acl", onSuccess, onFailure);
        },

        /**
         * Hands back the authorities that the given principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        listAuthorities: function(principal, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(response)
            {
                successCallback(response.rows);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaGet("/repositories/" + this.getId() + "/acl/" + principalId, onSuccess, onFailure);
        },

        /**
         * Checks whether the given principal has an authority.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        checkAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(authorities)
            {
                var has = false;

                for (var i = 0; i < authorities.length; i++)
                {
                    if (authorities[i] == authorityId)
                    {
                        has = true;
                        break;
                    }
                }

                successCallback(has);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.listAuthorities(principal, onSuccess, onFailure);
        },

        /**
         * Grants an authority for a principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        grantAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/repositories/" + this.getId() + "/acl/" + principalId + "/grant/" + authorityId, {}, onSuccess, onFailure);
        },

        /**
         * Revokes an authority for a principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param {String} authorityId the id of the authority
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAuthority: function(principal, authorityId, successCallback, failureCallback)
        {
            var _this = this;

            // figure out the principal id
            var principalId = null;
            if (this.isString(principal))
            {
                principalId = principal;
            }
            else
            {
                principalId = principal.getPrincipalId();
            }

            var onSuccess = function(status)
            {
                successCallback(status);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.gitanaPost("/repositories/" + this.getId() + "/acl/" + principalId + "/revoke/" + authorityId, {}, onSuccess, onFailure);
        },

        /**
         * Revokes all authorities for a principal.
         *
         * @param {Gitana.Principal|String} principal the principal or the principal id
         * @param [Function] successCallback The function to call if the operation succeeds.
         * @param [Function] failureCallback The function to call if the operation fails.
         */
        revokeAllAuthorities: function(principal, successCallback, failureCallback)
        {
            this.revokeAuthority(principal, "all", successCallback, failureCallback);
        }

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ACL METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////


    });

})(window);
