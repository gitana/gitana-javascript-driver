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
        constructor: function(persistable, object)
        {
            this.base(persistable, object);

            this.objectType = function() { return "Gitana.NodeAttachmentMap"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.NodeAttachmentMap(this.__persistable(), this);
        },

        /**
         * @param json
         */
        buildObject: function(attachment)
        {
            return new Gitana.NodeAttachment(this.__persistable(), attachment);
        }


    });

})(window);
