(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Client = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Client.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Client
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Client";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/clients/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().client(this.getPlatform(), this.object);
        }

    });

})(window);
