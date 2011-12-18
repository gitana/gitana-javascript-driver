(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Vault = Gitana.DataStore.extend(
    /** @lends Gitana.Vault.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.DataStore
         *
         * @class Vault
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Vault";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().vault(this.getPlatform(), this.object);
        }


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ARCHIVES
        //
        //////////////////////////////////////////////////////////////////////////////////////////


    });

})(window);
