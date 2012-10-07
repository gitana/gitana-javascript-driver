(function(window)
{
    var Gitana = window.Gitana;

    Gitana.BinaryAttachmentMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.BinaryAttachmentMap.prototype */
    {
        constructor: function(persistable)
        {
            this.objectType = function() { return "Gitana.BinaryAttachmentMap"; };

            this.persistable = function() {
                return persistable;
            };

            // must come at end because loading of object requires persistable() method
            this.base(persistable.getDriver(), persistable.system()["attachments"]);
        },

        /**
         * @param json
         */
        buildObject: function(attachment)
        {
            return new Gitana.BinaryAttachment(this.persistable(), attachment);
        }

    });

})(window);
