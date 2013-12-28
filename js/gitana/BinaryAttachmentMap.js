(function(window)
{
    var Gitana = window.Gitana;

    Gitana.BinaryAttachmentMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.BinaryAttachmentMap.prototype */
    {
        constructor: function(persistable, object)
        {
            this.objectType = function() { return "Gitana.BinaryAttachmentMap"; };

            this.__persistable = (function() {
                var _persistable = persistable;
                return function(p) {
                    if (!Gitana.isUndefined(p)) { _persistable = p; }
                    return _persistable;
                };
            })();

            if (!object)
            {
                object = this.__persistable().getSystemMetadata()["attachments"];
            }

            // must come at end because loading of object requires persistable() method
            this.base(this.__persistable().getDriver(), object);
        },

        /**
         * Override to include:
         *
         *   __persistable
         *
         * @param otherObject
         */
        chainCopyState: function(otherObject)
        {
            this.base(otherObject);

            if (otherObject.__persistable) {
                this.__persistable(otherObject.__persistable());
            }
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.BinaryAttachmentMap(this.__persistable(), this);
        },

        /**
         * @param json
         */
        buildObject: function(attachment)
        {
            return new Gitana.BinaryAttachment(this.__persistable(), attachment);
        }

    });

})(window);
