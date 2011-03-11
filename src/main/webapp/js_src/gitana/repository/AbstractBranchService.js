(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Abstract class for services that are constrained to a branch.
     */
    Gitana.AbstractBranchService = Gitana.AbstractService.extend({

        constructor: function(branch)
        {
            this.base(branch.getDriver());

            // priviledged methods
            this.getRepository = function() { return branch.getRepository(); };
            this.getRepositoryId = function() { return branch.getRepository().getId(); };
            this.getBranch = function() { return branch; };
            this.getBranchId = function() { return branch.getId(); };

            // build method to assist with constructing node wrapper objects
            var nodeFactory = new Gitana.NodeFactory();
            this.build = function(object)
            {
                return nodeFactory.produce(branch, object);
            };
            this.buildList = function(array)
            {
                var list = [];
                for each (element in array)
                {
                    list[list.length] = this.build(element);
                }
                return list;
            };
            this.buildMap = function(array)
            {
                var map = {};
                for each (element in array)
                {
                    map[element.getId()] = this.build(element);
                }
                return map;
            };            
        }

    });

})(window);
