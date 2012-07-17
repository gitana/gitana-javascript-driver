(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Registration = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Registration.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Registration
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application.getPlatform(), object);

            this.objectType = "Gitana.Registration";

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
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/registrations/" + this.getId();
        },

        sendConfirmationEmail: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/send/confirmation";
            };

            return this.chainPostEmpty(this, uriFunction, {}, this.object);
        },

        sendWelcomeEmail: function()
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/send/welcome";
            };

            return this.chainPostEmpty(this, uriFunction, {}, this.object);
        },

        confirm: function(newUserPassword, paymentMethodObject)
        {
            if (!paymentMethodObject)
            {
                paymentMethodObject = {};
            }

            var params = {
                "password": newUserPassword
            };

            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/confirm";
            };

            return this.chainPostEmpty(this, uriFunction, params, paymentMethodObject);
        }
    });

})(window);
