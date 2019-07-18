(function(window)
{
    Gitana = window.Gitana;

    Gitana.BinaryAttachment = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.BinaryAttachment.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Binary Attachment
         *
         * @param {Object} persistable gitana object
         * @param {Object} attachment
         */
        constructor: function(persistable, attachment)
        {
            this.base(persistable.getDriver(), attachment);

            this.objectType = function() { return "Gitana.BinaryAttachment"; };

            this.persistable = function() {
                return persistable;
            };
        },

        getId: function()
        {
            return this.attachmentId;
        },

        getLength: function()
        {
            return this.length;
        },

        getContentType: function()
        {
            return this.contentType;
        },

        getFilename: function()
        {
            return this.filename;
        },

        getUri: function()
        {
            return this.persistable().getUri() + "/attachments/" + this.getId();
        },

        getDownloadUri: function()
        {
            return this.getDriver().baseURL + this.getUri();
        },

        getPreviewUri: function(name, config)
        {
            if (!config)
            {
                config = {};
            }

            config.attachment = this.attachmentId;

            return this.persistable().getPreviewUri(name, config);
        },

        /**
         * Deletes the attachment, hands back control to the persistable.
         *
         * @chained persistable
         */
        del: function()
        {
            const self = this;

            const result = this.subchain(this.persistable());

            // our work (first in chain)
            result.subchain(self).then(function() {

                const chain = this;

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
            const self = this;

            return this.then(function() {

                const chain = this;

                // download
                this.getDriver().gitanaDownload(this.getUri(), null, function(data) {
                    callback.call(self, data);
                    chain.next();
                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });
        },

        stream: function(callback)
        {
            if (!Gitana.streamDownload) {
                throw new Error("XHR streaming not supported - this method will only work when running in Node.js");
            }

            Gitana.streamDownload(this, function(err, stream) {
                callback(err, stream);
            });
        }

    });

})(window);
