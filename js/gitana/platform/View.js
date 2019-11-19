(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.View = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.View.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class View
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.View"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_VIEW;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/views/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().view(this.getPlatform(), this);
        }

    });

})(window);
