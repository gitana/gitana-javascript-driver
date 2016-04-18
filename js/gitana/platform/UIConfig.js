(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.UIConfig = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.UIConfig.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class UIConfig
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.UIConfig"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_UICONFIG;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/uiconfigs/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().uiConfig(this.getPlatform(), this);
        }
    });

})(window);
