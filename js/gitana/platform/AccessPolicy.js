(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AccessPolicy = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AccessPolicy.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AccessPolicy
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.AccessPolicy"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_ACCESS_POLICY;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/access/policies/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().accessPolicy(this.getPlatform(), this);
        }

    });

})(window);
