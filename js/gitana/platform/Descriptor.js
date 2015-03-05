(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Descriptor = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Descriptor.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Descriptor
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Descriptor"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DESCRIPTOR;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/descriptors/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().descriptor(this.getPlatform(), this);
        }

    });

})(window);
