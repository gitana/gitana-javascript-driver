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
        constructor: function(persistable, _map)
        {
            this.base(persistable, _map);

            this.objectType = "Gitana.NodeAttachmentMap";

            this.produce = function(attachmentId, attachment)
            {
                return new Gitana.NodeAttachment(this.persistable, attachmentId, attachment);
            }
        }

    });

})(window);
