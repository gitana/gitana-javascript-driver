(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.ArchiveMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.ArchiveMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class ArchiveMap
         *
         * @param {Gitana.Vault} vault Gitana vault instance.
         * @param [Object] object
         */
        constructor: function(vault, object)
        {
            this.objectType = "Gitana.ArchiveMap";


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


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(vault.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().archiveMap(this.getVault(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().archive(this.getVault(), json);
        }

    });

})(window);
