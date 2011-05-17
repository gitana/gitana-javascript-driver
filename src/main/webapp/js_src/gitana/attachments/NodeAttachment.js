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
         * @augments Base
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {String} attachmentId
         * @param {Object} attachment
         */
        constructor: function(persistable, attachmentId, attachment)
        {
            this.base(persistable, attachmentId, attachment);
        },

        getFilename: function()
        {
            return this.attachment.filename;
        }

    });

})(window);
