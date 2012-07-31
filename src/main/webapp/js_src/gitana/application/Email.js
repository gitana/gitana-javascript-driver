(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Email = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Email.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Email
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application.getPlatform(), object);

            this.objectType = "Gitana.Email";

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
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_EMAIL;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/emails/" + this.getId();
        },

        /**
         * Sends this email using the given email provider.
         *
         * @param emailProvider
         *
         * @chained this
         *
         * @return this
         */
        send: function(emailProvider)
        {
            return this.then(function() {
                this.subchain(emailProvider).send(this);
            });
        }

    });

})(window);
