(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Directory = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Directory.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Directory
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = function() { return "Gitana.Directory"; };

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/directories/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_DIRECTORY;
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().directory(this.getPlatform(), this);
        },




        /////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // IDENTITIES
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads an identity.
         *
         * @chained identity
         *
         * @param {String} identityId the identity id
         */
        readIdentity: function(identityId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/identities/" + identityId;
            };

            var chainable = this.getFactory().identity(this);
            return this.chainGet(chainable, uriFunction);
        }

    });

})(window);
