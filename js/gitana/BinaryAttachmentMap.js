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
         * @param persistable
         * @param map
         */
        constructor: function(persistable, _map)
        {
            this.base(persistable.getPlatform());

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

                this.keys = [];

                var count = 0;

                for (var i in this.map) {
                    this.keys.push(i);
                    count ++;
                }

                this.object['total_rows'] = count;
            }
        },

        get: function(key)
        {
            return this.map[key];
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
                //for (var attachmentId in attachments)
                for (var i = 0 ; i < this.keys.length ; i ++)
                {
                    var attachmentId = this.keys[i];

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
                if (!loaded)
                {
                    var err = new Gitana.Error();
                    err.name = "No attachment with id: " + attachmentId;
                    err.message = err.name;

                    this.error(err);

                    return false;
                }
                result.handleAttachment(loaded.attachment);
            });

            return result;
        },

        /**
         * Iterates over the map and applies the callback filter function to each element.
         * It should hand back true if it wants to keep the value and false to remove it.
         *
         * NOTE: the "this" for the callback is the object from the map.
         *
         * @chained
         *
         * @param callback
         */
        filter: function(callback)
        {
            return this.then(function() {

                var keysToKeep = [];
                var keysToRemove = [];

                for (var i = 0; i < this.keys.length; i++)
                {
                    var key = this.keys[i];
                    var object = this.map[key];

                    var keepIt = callback.call(object);
                    if (keepIt)
                    {
                        keysToKeep.push(key);
                    }
                    else
                    {
                        keysToRemove.push(key);
                    }
                }

                // remove any keys we don't want from the map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }

                // swap keys to keep
                // NOTE: we first clear the keys but we can't use slice(0,0) since that produces a NEW array
                // instead, do this shift trick
                while (this.keys.length > 0)
                {
                    this.keys.shift();
                }
                for (var i = 0; i < keysToKeep.length; i++)
                {
                    this.keys.push(keysToKeep[i]);
                }
            });
        },

        /**
         * Client-side pagination of elements in the map.
         *
         * @chained
         *
         * @param pagination
         */
        paginate: function(pagination)
        {
            return this.then(function() {

                var skip = pagination.skip;
                var limit = pagination.limit;
                var keysToRemove = [];

                // figure out which keys to remove
                for (var i = 0; i < this.keys.length; i++)
                {
                    if (i< skip || i >= skip + limit)
                    {
                        keysToRemove.push(this.keys[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.keys.length > limit + skip)
                {
                    this.keys.pop();
                }

                for (var i = 0 ; i < skip ; i++ )
                {
                    this.keys.shift();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }

            });
        },

        /**
         * Applies a comparator to sort the map.
         *
         * If no comparator is applied, the map will be sorted by its modification timestamp (if possible).
         *
         * The comparator can be a string that uses dot-notation to identify a field in the JSON that
         * should be sorted.  (example: "title" or "property1.property2.property3")
         *
         * Finally, the comparator can be a function.  It takes (previousValue, currentValue) and hands back:
         *   -1 if the currentValue is less than the previousValue (should be sorted lower)
         *   0 if they are equivalent
         *   1 if they currentValue is greater than the previousValue (should be sorted higher)
         *
         * @chained
         *
         * @param comparator
         */
        sort: function(comparator)
        {
            return this.then(function() {

                this.keys.sort(comparator);

            });
        }
    });

})(window);
