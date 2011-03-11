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
        },

        /**
         * Determines a title for this object.
         *
         * This will hand back the id of the object if nothing else can be found.
         */
        getTitle: function()
        {
            var title = this["title"];
            if (!title)
            {
                title = this.getId();
            }

            return title;
        },

        /**
         * Determines a description for this object.
         *
         * This will hand back the id of the object if nothing else can be found.
         */
        getDescription: function()
        {
            var description = this["description"];
            if (!description)
            {
                description = this.getId();
            }
            
            return description;
        },

        /**
         * @Abstract
         *
         * Reloads the object from the server and then fires the callback.
         *
         * @param callback
         */
        reload: function(callback)
        {
             // ABSTRACT - must be implemented by inheriting classes
        },

        /**
         * Replaces all of the properties of this object with those of the given json.
         * This method should be used to update the state of this object.
         *
         * @param json
         */
        replacePropertiesWith: function(json)
        {
            // create a copy of the incoming json
            var candidate = {};
            this.copyInto(candidate, json);

            // we don't allow the following values to be replaced
            var doc = this["_doc"];
            delete candidate["_doc"];

            // remove our properties
            for (var i in this) {
                if (this.hasOwnProperty(i) && !this.isFunction(this[i])) {
                    delete this[i];
                }
            }

            // restore
            this["_doc"] = doc;

            // copy in candidate properties
            this.copyInto(this, candidate);
        }

    });

})(window);
