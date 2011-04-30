(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeAudits = Gitana.AbstractNodeService.extend(
    /** @lends Gitana.NodeAudits.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNodeService
         *
         * @class Node Audits Service
         *
         * @param {Gitana.Node} node The Gitana Node to which this service is constrained.
         */
        constructor: function(node)
        {
            this.base(node);
        },

        /**
         * Acquire a list of definitions.
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
                    list.push(new Gitana.AuditRecord(_this.getDriver(), response.rows[i]));
                }
                response.list = list;

                successCallback(response);
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            var url = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/auditrecords";
            this.getDriver().gitanaGet(url, onSuccess, onFailure);
        }
    });

})(window);
