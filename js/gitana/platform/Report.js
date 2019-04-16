(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Report = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Report.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Report
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Report"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_REPORT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/reports/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().report(this.getPlatform(), this);
        }

    });

})(window);
