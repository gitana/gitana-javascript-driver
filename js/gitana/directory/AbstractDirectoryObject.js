(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractDirectoryObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractDirectoryObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AbstractDirectoryObject
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
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getDirectoryId() + "/" + this.getId();
        }

    });

})(window);
