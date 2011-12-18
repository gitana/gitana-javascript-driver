(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Archive = Gitana.AbstractObject.extend(
    /** @lends Gitana.Archive.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Archive
         *
         * @param {Gitana.Vault} vault
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(vault, object)
        {
            this.base(vault.getPlatform(), object);

            this.objectType = "Gitana.Archive";



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Vault object.
             *
             * @inner
             *
             * @returns {Gitana.Vault} The Gitana Vault object
             */
            this.getVault = function() { return vault; };

            /**
             * Gets the Gitana Vault id.
             *
             * @inner
             *
             * @returns {String} The Gitana Vault id
             */
            this.getVaultId = function() { return vault.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getVaultId() + "/archives/" + this.getId();
        }

    });

})(window);
