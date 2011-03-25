(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractNodeService = Gitana.AbstractBranchService.extend(
    /** @lends Gitana.AbstractNodeService.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractBranchService
         *
         * @class Abstract base class for Gitana Node services.
         *
         * @param {Gitana.Node} node The Gitana Node to which this service is constrained.
         */
        constructor: function(node)
        {
            this.base(node.getBranch());

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Node object.
             *
             * @inner
             *
             * @returns {Gitana.Node} The Gitana Node object
             */
            this.getNode = function() { return node; };

            /**
             * Gets the Gitana Node object id.
             *
             * @inner
             *
             * @returns {String} The Gitana Node object id
             */
            this.getNodeId = function() { return node.getId(); };
        }

    });

})(window);
