(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Connection = Gitana.AbstractDirectoryObject.extend(
    /** @lends Gitana.Connection.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractDirectoryObject
         *
         * @class AbstractDirectoryObject
         *
         * @param {Gitana.Directory} directory
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(directory, object)
        {
            this.base(directory, object);

            this.objectType = function() { return "Gitana.Connection"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_CONNECTION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/directories/" + this.getDirectoryId() + "/connections/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().connection(this.getDirectory(), this);
        }

    });

})(window);
