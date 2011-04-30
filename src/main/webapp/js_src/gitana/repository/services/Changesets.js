(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Changesets = Gitana.AbstractRepositoryService.extend(
    /** @lends Gitana.Changesets.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryService
         *
         * @class Changesets Service
         *
         * @param {Gitana.Repository} repository The Gitana Repository object for this service.
         */
        constructor: function(repository)
        {
            this.base(repository);
        },
        
        /**
         * Acquires a list of changesets in the repository.
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
                for (var i = 0; i < response.rows.length; i++)
                {
                    list.push(new Gitana.Changeset(_this.getRepository(), response.rows[i]));
                }
                response.list = list;

                // fire the callback
                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets", onSuccess, onFailure);
        },

        /**
         * Acquires a changeset.
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(changesetId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(new Gitana.Changeset(_this.getDriver(), response));
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId, onSuccess, onFailure);
        },

        /**
         * Acquires a list of the parent changesets for a given changeset.
         *
         * @public
         *
         * @param {String} changesetId the id of the changeset
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        parents: function(changesetId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var list = [];

                for (var i = 0; i < response.rows.length; i++)
                {
                    list.push(new Gitana.Changeset(_this.getRepository(), response.rows[i]));
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId + "/parents", onSuccess, onFailure);
        },

        /**
         * Acquires a list of the child changesets for a given changeset.
         *
         * @public
         * 
         * @param {String} changesetId the id of the changeset
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        children: function(changesetId, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                var list = [];

                for (var i = 0; i < response.rows.length; i++)
                {
                    list.push(new Gitana.Changeset(_this.getRepository(), response.rows[i]));
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/changesets/" + changesetId + "/children", onSuccess, onFailure);
        }

    });

})(window);
