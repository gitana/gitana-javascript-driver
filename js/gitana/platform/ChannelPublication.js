(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ChannelPublication = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.ChannelPublication.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class ChannelPublication
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.ChannelPublication"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CHANNEL_PUBLICATION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/channel/publications/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().channelPublication(this.getPlatform(), this);
        }

    });

})(window);
