(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Node attachments are similar to binary attachments.  They're identical in structure except that they
     * additionally provide information about the original filename.
     */
    Gitana.NodeAttachment = Gitana.BinaryAttachment.extend(
    /** @lends Gitana.NodeAttachment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.BinaryAttachment
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {Object} attachment
         */
        constructor: function(persistable, attachment)
        {
            this.base(persistable, attachment);
        },

        /**
         * Gets attachment file name
         * @returns {String} attachment file name
         */
        getFilename: function()
        {
            return this.filename;
        }

    });

})(window);
