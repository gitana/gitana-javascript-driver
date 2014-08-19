(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Archive = Gitana.AbstractVaultObject.extend(
    /** @lends Gitana.Archive.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractVaultObject
         *
         * @class Archive
         *
         * @param {Gitana.Vault} vault
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(vault, object)
        {
            this.base(vault, object);

            this.objectType = function() { return "Gitana.Archive"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_ARCHIVE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getVaultId() + "/archives/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().archive(this.getVault(), this);
        },

        /**
         * Gets the URI used to download the archive
         */
        getDownloadUri: function()
        {
            return this.getProxiedUri() + "/download";
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @param local
         *
         * @public
         */
        listAttachments: Gitana.Methods.listAttachments(),

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: Gitana.Methods.attach(),

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach(),

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri()

    });

})(window);
