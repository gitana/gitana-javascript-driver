(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Abstract class that provides methods for document objects that originate
     * from the Gitana repository.
     */
    Gitana.AbstractGitanaObject = Gitana.AbstractObject.extend(
    {
        constructor: function(driver, object)
        {
            this.base(object);

            // remove things that we don't want to keep around
            delete this["_ref"];

            // copy system metadata off into separate object (it is read-only)
            var systemMetadata = {};
            this.copyInto(systemMetadata, this["_system"]);
            delete this["_system"];
            this.system = function() { return systemMetadata; };

            // priviledged methods
            this.getDriver = function() { return driver; };
        },

        /**
         * The id of the object
         */
        getId: function()
        {
            return this["_doc"];
        },

        /**
         * Returns the system metadata for this object.
         */
        getSystemMetadata: function()
        {
            return new Gitana.SystemMetadata(this.system());
        }        

    });

})(window);
