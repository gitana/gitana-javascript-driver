(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WorkflowInstanceMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.WorkflowInstanceMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of workflow instances
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param [Object] object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.WorkflowInstanceMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(platform, object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().workflowInstanceMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().workflowInstance(this.getPlatform(), json);
        }

    });

})(window);
