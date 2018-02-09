(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Channel = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Channel.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Channel
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Channel"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CHANNEL;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/channels/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().channel(this.getPlatform(), this);
        }

    });

})(window);
