(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Connection = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Connection.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Connection
         *
         * @param {Gitana.Directory} directory
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(directory, object)
        {
            this.base(directory.getPlatform(), object);

            this.objectType = function() { return "Gitana.Connection"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getDirectory = function()
            {
                return directory;
            };

            this.getDirectoryId = function()
            {
                return directory.getId();
            };
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
