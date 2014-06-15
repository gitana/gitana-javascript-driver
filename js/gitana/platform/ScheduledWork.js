(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ScheduledWork = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.ScheduledWork.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class ScheduledWork
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.ScheduledWork"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_SCHEDULED_WORK;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/work/scheduled/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().scheduledWork(this.getPlatform(), this);
        }

    });

})(window);
