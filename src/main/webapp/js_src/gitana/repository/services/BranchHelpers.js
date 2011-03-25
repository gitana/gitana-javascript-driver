(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.BranchHelpers = Gitana.AbstractBranchService.extend(
    /** @lends Gitana.BranchHelpers.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractBranchService
         *
         * @class Branch helpers service
         *
         * @param {Gitana.Branch} branch The branch to which the service should be constrained.
         */
        constructor: function(branch)
        {
            this.base(branch);
        },
        
        /**
         * Determines an available QName on this branch given some input.
         * This makes a call to the repository and asks it to provide a valid QName.
         *
         * Note: This QName is a recommended QName that is valid at the time of the call.
         *
         * If another thread writes a node with the same QName after this call but ahead of this thread
         * attempting to commit, an invalid qname exception may still be thrown back.
         *
         * @public
         * 
         * @param {Object} object an object with "title" or "description" fields to base generation upon
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        generateQName: function(object, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                successCallback(response["_qname"]);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/qnames/generate", object, onSuccess, onFailure);
        }


    });

})(window);
