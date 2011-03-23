(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Branch helper functions
     */
    Gitana.BranchHelpers = Gitana.AbstractBranchService.extend(
    {
        /**
         * Determines an available QName on this branch given some input.
         * This makes a call to the repository and asks it to provide a valid QName.
         *
         * Note: This QName is a recommended QName that is valid at the time of the call.
         *
         * If another thread writes a node with the same QName after this call but ahead of this thread
         * attempting to commit, an invalid qname exception may still be thrown back.
         *
         * @param object an object with "title" or "description" fields to base generation upon
         * @param successCallback (optional)
         * @param failureCallback (optional)
         */
        generateQName: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            // REQUIRED
            var object = args.shift();

            // OPTIONAL
            var successCallback = args.shift();
            var failureCallback = args.shift();
            if (!failureCallback)
            {
                failureCallback = this.ajaxErrorHandler;
            }

            // invoke
            this.getDriver().gitanaPost("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/qnames/generate", object, function(response) {

                if (successCallback)
                {
                    successCallback(response["_qname"]);
                }

            }, failureCallback);

        }


    });

})(window);
