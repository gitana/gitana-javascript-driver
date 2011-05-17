(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.BinaryAttachmentMap = Gitana.AbstractPersistable.extend(
    /** @lends Gitana.BinaryAttachmentMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPersistable
         *
         * @class Provides access to binaries
         *
         * @param repository
         * @param map
         */
        constructor: function(persistable, _map)
        {
            this.base(persistable.getServer());

            this.persistable = persistable;
            this.map = _map;

            // helper method to produce a bunch of attachment wrappers
            this.getAttachments = function()
            {
                var attachments = {};

                for (var attachmentId in this.map)
                {
                    var attachment = new Gitana.BinaryAttachment(persistable, attachmentId, this.map[attachmentId]);
                    attachments[attachmentId] = attachment;
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
            return this.then(function() {

                var count = Gitana.getNumberOfKeys(this.getAttachments());

                callback.call(this, count);
            });
        },

        each: function(callback)
        {
            return this.then(function() {

                var count = 0;
                var attachments = this.getAttachments();
                for (var attachmentId in attachments)
                {
                    var attachment = attachments[attachmentId];

                    // a function that fires our callback
                    // wrap in a closure so that we store the callback and key
                    // note: this = the value wrapped in a chain, so we don't pass in value
                    var f = function(callback, key, index)
                    {
                        return function()
                        {
                            callback.call(this, key, this, index);
                        };

                    }(callback, attachmentId, count);

                    // create subchain mounted on this chainable and the run function
                    this.subchain(attachment).then(f);
                    count++;
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
            return this.subchain(this.getAttachments()[attachmentId]);
        }

    });

})(window);
