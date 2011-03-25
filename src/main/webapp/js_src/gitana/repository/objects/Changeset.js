(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Changeset = Gitana.AbstractGitanaObject.extend(
    /** @lends Gitana.Changeset.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractGitanaObject
         *
         * @class Changeset
         *
         * @param {Gitana.Repository} repository
         * @param {Object} object JSON object
         */
        constructor: function(repository, object)
        {
            this.base(repository.getDriver(), object);

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return repository; };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return repository.getId(); };
        },

        /**
         * @Override
         */
        reload: function(successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(changeset)
            {
                _this.replacePropertiesWith(changeset);

                if (successCallback)
                {
                    successCallback(changeset);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            this.getRepository().changesets().read(this.getId(), onSuccess, onFailure);
        },

        /**
         * Update the changeset.
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
            this.getDriver().gitanaPut("/repositories/" + this.getRepositoryId() + "/changesets/" + this.getId(), this, onSuccess, onFailure);
        }

    });

})(window);
