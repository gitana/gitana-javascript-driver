(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Abstract class that provides helper functions for Gitana services.
     */
    Gitana.AbstractService = Gitana.Abstract.extend({

        constructor: function(driver)
        {
            this.base();
            
            // priviledged methods
            this.getDriver = function() { return driver; };
        },

        /**
         * Builds a node for the given object json.
         */
        build: function(branch)
        {
            return this.getDriver().nodeFactory.produce()
            return this.nodeFactory;
        }


    });

})(window);
