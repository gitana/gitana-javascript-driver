(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractVaultObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractVaultObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AbstractVaultObject
         *
         * @param {Gitana.Vault} vault
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(vault, object)
        {
            this.base(vault.getPlatform(), object);

            this.objectType = function() { return "Gitana.Archive"; };



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
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getVaultId() + "/" + this.getId();
        }

    });

})(window);
