(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Attachments = Gitana.AbstractNodeService.extend(
    /** @lends Gitana.Attachments.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractNodeService
         *
         * @class Attachments Service
         *
         * @param {Gitana.Node} node The Gitana Node to which this service is constrained.
         */
        constructor: function(node)
        {
            this.base(node);
        },

        /**
         * Gets an array of attachment ids
         */
        keys: function()
        {
            var keys = [];

            var attachments = this.getNode()["attachments"];
            if (attachments)
            {
                for (var attachmentId in attachments)
                {
                    keys.push(attachmentId);
                }
            }

            return keys;
        },

        /**
         * Gets an attachment for a given attachment id
         *
         * @param [String] attachmentId
         */
        get: function(attachmentId)
        {
            var attachment = null;

            // default attachment id
            if (!attachmentId)
            {
                attachmentId = "bytearray";
            }

            // retrieve
            var attachments = this.getNode()["attachments"];
            if (attachments)
            {
                attachment = attachments[attachmentId];
            }

            return attachment;
        },

        /**
         * Gets the length of an attachment.
         *
         * @param [String] attachmentId
         */
        getLength: function(attachmentId)
        {
            var length = -1;

            // default attachment id
            if (!attachmentId)
            {
                attachmentId = "bytearray";
            }

            // retrieve
            var attachment = this.getNode()["attachments"][attachmentId];
            if (attachment)
            {
                length = attachment["length"];
            }

            return length;
        },

        /**
         * Gets the content type of an attachment.
         *
         * @param [String] attachmentId
         */
        getContentType: function(attachmentId)
        {
            var contentType = null;

            // default attachment id
            if (!attachmentId)
            {
                attachmentId = "bytearray";
            }

            // retrieve
            var attachment = this.getNode()["attachments"][attachmentId];
            if (attachment)
            {
                contentType = attachment["contentType"];
            }

            return contentType;
        },

        /**
         * Gets the filename of an attachment
         *
         * @param [String] attachmentId
         */
        getFilename: function(attachmentId)
        {
            var filename = null;

            // default attachment id
            if (!attachmentId)
            {
                attachmentId = "bytearray";
            }

            // retrieve
            var attachment = this.getNode()["attachments"][attachmentId];
            if (attachment)
            {
                filename = attachment["filename"];
            }

            return filename;
        },

        /**
         * Gets the URI for an attachment.
         *
         * @param [String] attachmentId
         */
        getURI: function(attachmentId)
        {
            var filename = null;

            // default attachment id
            if (!attachmentId)
            {
                attachmentId = "bytearray";
            }

            var uri = null;

            var filename = this.getFilename(attachmentId);
            if (filename)
            {
                uri = "/repositories/" + this.getRepositoryId() + "/branches/" + this.getBranchId() + "/nodes/" + this.getNodeId() + "/attachment/" + attachmentId + "?filename=" + filename;
            }

            return uri;
        }

    });

})(window);
