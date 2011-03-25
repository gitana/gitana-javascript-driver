(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Definitions = Gitana.AbstractBranchService.extend(
    /** @lends Gitana.Definitions.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractBranchService
         *
         * @class Definitions service
         *
         * @param {Gitana.Branch} branch The branch to which the service should be constrained.
         */
        constructor: function(branch)
        {
            this.base(branch);
        },

        /**
         * Acquire a list of definitions.
         *
         * @public
         *
         * @param [String] filter Optional filter of the kind of definition to fetch - "association", "type" or "feature"
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        list: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            var filter = null;
            var successCallback = null;
            var failureCallback = null;
            if (args.length == 1)
            {
                successCallback = args.shift();
            }
            else if (args.length == 2)
            {
                filter = args.shift();
                successCallback = args.shift();
            }
            else if (args.length == 3)
            {
                filter = args.shift();
                successCallback = args.shift();
                failureCallback = args.shift();
            }

            var onSuccess = function(response)
            {
                response.list = _this.buildList(response.rows);

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/definitions";
            if (filter)
            {
                url = url + "?filter=" + filter;
            }
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        },

        /**
         * Reads a definition by qname.
         *
         * @public
         *
         * @param {String} qname the qname
         * @param {Function} successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        read: function(qname, successCallback, failureCallback)
        {
            var _this = this;
            
            var onSuccess = function(response)
            {
                var node = _this.build(response);

                successCallback(node);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/definitions/" + qname, onSuccess, onFailure);
        }
        
    });

})(window);
