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
        },

        /**
         * Transforms an attachment.
         *
         * @param targetAttachmentId the attachment ID into which the transformed result should be stored
         * @param targetMimetype the mimetype for the generated target attachment
         * @param overwrite whether to overwrite the target attachment
         * @param config the transformation config
         *
         * The transformation config can look something like this:
         *
            {
                "width": <int>,
                "height": <int>,
                "crop": {
                    "x": <int>,
                    "y": <int>,
                    "width": <int>,
                    "height": <int>
                },
                "scale": {
                    "x": <float>,
                    "y": <float>
                },
                "rotate": <float>
            }
         */
        transform: function(targetAttachmentId, targetMimetype, overwrite, config, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/transform";
            };

            var params = {};
            params.attachmentId = targetAttachmentId;
            params.mimetype = targetMimetype;
            params.overwrite = overwrite ? true : false;

            return this.chainPostResponse(null, uriFunction, params, config).then(function(response) {
                callback.call(this, response);
            });
        }

    });

})(window);
