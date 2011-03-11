(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Abstract class for services that are constrained to a branch.
     */
    Gitana.AbstractNodeService = Gitana.AbstractBranchService.extend({

        constructor: function(node)
        {
            this.base(node.getBranch());

            // priviledged methods
            this.getNode = function() { return node; };
            this.getNodeId = function() { return node.getId(); };
        }

    });

})(window);
