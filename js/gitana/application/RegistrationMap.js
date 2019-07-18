(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.RegistrationMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.RegistrationMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class RegistrationMap
         *
         * @param {Gitana.Application} application Gitana application instance.
         * @param {Object} object
         */
        constructor: function(application, object)
        {
            this.objectType = function() { return "Gitana.RegistrationMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Application object.
             *
             * @inner
             *
             * @returns {Gitana.Application} The Gitana Application object
             */
            this.getApplication = function() { return application; };

            /**
             * Gets the Gitana Application id.
             *
             * @inner
             *
             * @returns {String} The Gitana Application id
             */
            this.getApplicationId = function() { return application.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(application.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().registrationMap(this.getApplication(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().registration(this.getApplication(), json);
        }

    });

})(window);
