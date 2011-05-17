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

            this.objectType = "Gitana.BinaryAttachmentMap";

            this.persistable = persistable;
            this.map = {};

            this.handleMap(_map);


            // priviledged methods

            this.getAttachments = function()
            {
                var attachments = {};

                for (var attachmentId in this.map)
                {
                    attachments[attachmentId] = this.produce(attachmentId, this.map[attachmentId]);
                }

                return attachments;
            },

            this.produce = function(attachmentId, attachment)
            {
                return new Gitana.BinaryAttachment(this.persistable, attachmentId, attachment);
            }
        },

        handleMap: function(map)
        {
            // empty the map object
            for (var i in this.map) {
                if (this.map.hasOwnProperty(i)) {
                    delete this.map[i];
                }
            }

            if (map)
            {
                Gitana.copyInto(this.map, map);
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
            var self = this;

            if (!attachmentId)
            {
                attachmentId = "default";
            }

            // what we hand back
            var result = this.subchain(this.produce(attachmentId));

            // auto-load on subchain
            result.subchain().then(function() {

                var loaded = self.getAttachments()[attachmentId];
                result.handleAttachment(loaded.attachment);
            });

            return result;
        }

    });

})(window);
