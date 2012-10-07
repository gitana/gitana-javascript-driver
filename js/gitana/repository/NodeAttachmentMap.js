(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeAttachmentMap = Gitana.BinaryAttachmentMap.extend(
    /** @lends Gitana.NodeAttachmentMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.BinaryAttachmentMap
         *
         * @class Provides access to node attachments
         *
         * @param repository
         * @param map
         */
        constructor: function(persistable)
        {
            this.base(persistable);

            this.objectType = function() { return "Gitana.NodeAttachmentMap"; };
        },

        /**
         * @param json
         */
        buildObject: function(attachment)
        {
            return new Gitana.NodeAttachment(this.persistable(), attachment);
        }


    });

})(window);
