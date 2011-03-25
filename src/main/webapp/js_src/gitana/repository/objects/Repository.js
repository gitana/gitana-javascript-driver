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
        }

    });

})(window);
