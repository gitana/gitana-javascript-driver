(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractBranchService = Gitana.AbstractRepositoryService.extend(
    /** @lends Gitana.AbstractBranchService.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryService
         *
         * @class Abstract base class for a branch service.
         *
         * @param {Gitana.Branch} branch The branch to which the service should be constrained.
         */
        constructor: function(branch)
        {
            this.base(branch.getRepository());

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };

            /**
             * Builds a node for the given JSON object.
             *
             * @param {Object} JSON object representing the node
             *
             * @inner
             *
             * @returns {Gitana.Node} the Gitana Node
             */
            this.build = function(object)
            {
                return branch.getDriver().nodeFactory().produce(branch, object);
            };

            /**
             * Builds a list of nodes for a given array of JSON objects.
             *
             * @inner
             *
             * @returns {Array} An array of Gitana Node objects.
             */
            this.buildList = function(array)
            {
                return branch.getDriver().nodeFactory().list(branch, array);
            };
            
            /**
             * Builds a map of nodes for a given array of JSON objects.
             *
             * @inner
             *
             * @returns {Object} A map of Gitana Node objects keyed by node id
             */
            this.buildMap = function(array)
            {
                return branch.getDriver().nodeFactory().map(branch, array);
            };
        }

    });

})(window);
