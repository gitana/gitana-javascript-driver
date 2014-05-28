(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WorkflowTaskMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.WorkflowTaskMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of workflow tasks
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param [Object] object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.WorkflowTaskMap"; };


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
            return this.getFactory().workflowTaskMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().workflowTask(this.getPlatform(), json);
        }

    });

})(window);
