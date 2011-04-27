(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractGitanaObject = Gitana.AbstractObject.extend(
    /** @lends Gitana.AbstractGitanaObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Abstract base class for Gitana document objects that originate from the Gitana repository.
         *
         * @param {Gitana.Driver} driver Gitana driver instance.
         * @param {Object} object Gitana object
         */
        constructor: function(driver, object)
        {
            this.base(object);

            // remove things that we don't want to keep around
            delete this["_ref"];

            // copy system metadata off into separate object (it is read-only)
            var _systemMetadata = {};
            this.copyInto(_systemMetadata, this["_system"]);
            delete this["_system"];
            var systemMetadata = new Gitana.SystemMetadata(_systemMetadata);

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Hands back the system metadata object
             *
             * @inner
             * 
             * @returns {Gitana.SystemMetadata} the system metadata object
             */
            this.system = function() { return systemMetadata; };

            /**
             * Hands back the Gitana driver for this instance.
             *
             * @inner
             *
             * @returns {Gitana.Driver} the Gitana driver instance.
             */
            this.getDriver = function() { return driver; };

            /**
             * Helper to gets the principal id for a principal object, json structure or principal id itself.
             *
             * @param principal
             */
            this.extractPrincipalId = function(principal)
            {
                return driver.extractPrincipalId(principal);
            }

        },

        /**
         * Hands back the ID ("_doc") of this object.
         *
         * @public
         *
         * @returns {String} id
         */
        getId: function()
        {
            return this["_doc"];
        },

        /**
         * Hands back the system metadata for this object.
         *
         * @public
         *
         * @returns {Gitana.SystemMetadata} system metadata
         */
        getSystemMetadata: function()
        {
            return this.system();
        },

        /**
         * The title for the object.
         *
         * @public
         *
         * @returns {String} the title
         */
        getTitle: function()
        {
            return this["title"];
        },

        /**
         * The description for the object.
         *
         * @public
         *
         * @returns {String} the description
         */
        getDescription: function()
        {
            return this["description"];
        },

        /**
         * ABSTRACT METHOD
         * Reloads the object from the server and then fires the callback.
         *
         * @public
         * @abstract
         *
         * @param [successCallback] {Function} function to be invoked if operation succeeds
         * @param [failureCallback] {Function} function to be invoked if operation fails
         */
        reload: function(successCallback, failureCallback)
        {
             // ABSTRACT - must be implemented by inheriting classes
        },

        /**
         * Replaces all of the properties of this object with those of the given object.
         * This method should be used to update the state of this object.
         *
         * Any functions from the incoming object will not be copied.
         *
         * @public
         *
         * @param object {Object} object containing the properties
         */
        replacePropertiesWith: function(object)
        {
            // create a copy of the incoming object
            var candidate = {};
            this.copyInto(candidate, object);

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
