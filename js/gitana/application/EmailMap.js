(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.EmailMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.EmailMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class EmailMap
         *
         * @param {Gitana.Application} application Gitana application instance.
         * @param {Object} object
         */
        constructor: function(application, object)
        {
            this.objectType = function() { return "Gitana.EmailMap"; };


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
            return this.getFactory().emailMap(this.getApplication(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().email(this.getApplication(), json);
        }

    });

})(window);
