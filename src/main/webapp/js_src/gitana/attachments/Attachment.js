(function(window)
{
    var Gitana = window.Gitana;

    Gitana.Attachment = Gitana.Chainable.extend(
    /** @lends Gitana.Attachment.prototype */
    {
        /**
         * @constructs
         * @augments Base
         *
         * @class Attachment
         *
         * @param {String} attachmentId
         * @param {Gitana.Object} attachment JSON
         */
        constructor: function(node, attachmentId)
        {
            this.base(node.getDriver());

            this.objectType = "Gitana.Attachment";

            this.node = node;
            this.attachmentId = attachmentId;


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return node.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return node.getRepositoryId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return node.getBranch(); };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return node.getBranchId(); };

            /**
             * Gets the Gitana Node object.
             *
             * @inner
             *
             * @returns {Gitana.Node} The Gitana Node object
             */
            this.getNode = function() { return node; };

            /**
             * Gets the Gitana Node id.
             *
             * @inner
             *
             * @returns {String} The Gitana Node id
             */
            this.getNodeId = function() { return node.getId(); };

        },

        getId: function()
        {
            return this.attachmentId;
        },

        getLength: function()
        {
            var length = -1;

            var attachments = this.node.getSystemMetadata().attachments;
            if (attachments && attachments[this.getId()])
            {
                length = attachments[this.getId()].length;
            }

            return length;
        },

        getContentType: function()
        {
            var contentType = -1;

            var attachments = this.node.getSystemMetadata().attachments;
            if (attachments && attachments[this.getId()])
            {
                length = attachments[this.getId()].length;
            }

            return length;
        },

        getFilename: function()
        {
            return this.filename;
        },

        getUri: function()
        {
            return "/repositories/" + this.node.getRepositoryId() + "/branches/" + this.node.getBranchId() + "/nodes/" + this.node.getId() + "/attachments/" + this.attachmentId;
        },

        getDownloadUri: function()
        {
            return this.getDriver().serverURL + this.getUri();
        },

        /**
         * Deletes the attachment, hands back control to the node.
         *
         * @chained node
         */
        del: function()
        {
            var self = this;

            var result = this.subchain(this.node);

            // our work (first in chain)
            result.subchain(self).then(function() {

                var chain = this;

                // delete the attachment
                this.getDriver().gitanaDelete(this.getUri(), function() {

                    // reload node
                    chain.subchain(self.node).reload();
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
         * This is only usefulf or text-based mimetypes.
         * If you call download on something like a video file, you're going to end up in some pain.
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
                this.getDriver().gitanaGet(this.getUri(), function(data) {
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
