(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SettingsMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.SettingsMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class SettingsMap
         *
         * @param {Gitana.Application} application Gitana application instance.
         * @param [Object] object
         */
        constructor: function(application, object)
        {
            this.objectType = function() { return "Gitana.SettingsMap"; };


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
            return this.getFactory().settingsMap(this.getApplication(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().settings(this.getApplication(), json);
        }

    });

})(window);
