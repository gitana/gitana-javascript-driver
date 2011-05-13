(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AttachmentMap = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.AttachmentMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Provides access to attachments for a node
         *
         * @param {Gitana.Node} node
         */
        constructor: function(node)
        {
            this.base(node.getServer());


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


            // helper method to produce a bunch of attachment wrappers
            this.getAttachments = function()
            {
                var attachments = {};

                var map = this.getNode().getSystemMetadata().attachments;
                if (map)
                {
                    for (var attachmentId in map)
                    {
                        var attachment = this.getFactory().attachment(this.getNode(), attachmentId);
                        attachments[attachmentId] = attachment;
                    }
                }

                return attachments;
            }

        },

        /**
         * Counts the number of attachments.
         *
         * @param callback
         */
        count: function(callback)
        {
            var self = this;

            return this.then(function() {

                var count = Gitana.getNumberOfKeys(this.getAttachments());

                callback.call(this, count);
            });
        },

        each: function(callback)
        {
            return this.then(function() {

                var attachments = this.getAttachments();
                for (var attachmentId in attachments)
                {
                    var attachment = attachments[attachmentId];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key)
                    {
                        return function()
                        {
                            callback.call(this, key, this);
                        };

                    }(callback, attachmentId);

                    // create subchain mounted on this chainable and the run function
                    this.subchain(attachment).then(f);
                }

                return this;
            });
        },

        /**
         * Retrieves an individual attachment.
         *
         * @param attachmentId
         */
        select: function(attachmentId)
        {
            var self = this;

            var result = this.subchain(this.getFactory().attachment(this.getNode(), attachmentId));

            // push our logic to the front
            // all we do here is protect against the case where the attachment doesn't exist
            result.subchain().then(function() {

                var attachment = self.getAttachments()[attachmentId];
                if (!attachment)
                {
                    var err = new Error();
                    err.message = "Missing attachment: " + attachmentId + " for node: " + this.getNodeId();

                    return self.error(err);
                }
            });

            return result;
        }

    });

})(window);
