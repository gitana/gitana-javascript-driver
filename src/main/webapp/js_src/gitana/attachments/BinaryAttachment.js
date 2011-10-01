(function(window)
{
    var Gitana = window.Gitana;

    Gitana.BinaryAttachment = Gitana.Chainable.extend(
    /** @lends Gitana.BinaryAttachment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Chainable
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {String} attachmentId
         * @param {Object} attachment
         */
        constructor: function(persistable, attachmentId, attachment)
        {
            this.base(persistable.getDriver());

            this.objectType = "Gitana.BinaryAttachment";

            this.persistable = persistable;
            this.attachmentId = attachmentId;

            this.attachment = {};

            this.handleAttachment(attachment);
        },

        handleAttachment: function(attachment)
        {
            // empty the attachment object
            for (var i in this.attachment) {
                if (this.attachment.hasOwnProperty(i)) {
                    delete this.attachment[i];
                }
            }

            if (attachment)
            {
                Gitana.copyInto(this.attachment, attachment);
            }
        },

        getId: function()
        {
            return this.attachmentId;
        },

        getLength: function()
        {
            return this.attachment.length;
        },

        getContentType: function()
        {
            return this.attachment.contentType;
        },

        getUri: function()
        {
            return this.persistable.getUri() + "/attachments/" + this.getId();
        },

        getDownloadUri: function()
        {
            return this.getDriver().serverURL + this.getUri();
        },

        /**
         * Deletes the attachment, hands back control to the persistable.
         *
         * @chained persistable
         */
        del: function()
        {
            var self = this;

            var result = this.subchain(this.persistable);

            // our work (first in chain)
            result.subchain(self).then(function() {

                var chain = this;

                // delete the attachment
                this.getDriver().gitanaDelete(this.getUri(), null, function() {

                    chain.next();

                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });

            return result;
        },

        /**
         * Downloads the attachment.
         *
         * @chained attachment
         * @param callback
         */
        download: function(callback)
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // download
                this.getDriver().gitanaDownload(this.getUri(), null, function(data) {
                    callback.call(self, data);
                    chain.next();
                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });
        }

    });

})(window);
