(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.WorkflowModelMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.WorkflowModelMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of workflow models
         *
         * @param {Gitana.Platform} platform Gitana platform instance.
         * @param [Object] object
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.WorkflowModelMap"; };


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
            return this.getFactory().workflowModelMap(this.getPlatform(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().workflowModel(this.getPlatform(), json);
        }

    });

})(window);
