(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Application = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Application.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Application
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.Application";

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return "application";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().application(this.getPlatform(), this.object);
        }

    });

})(window);
