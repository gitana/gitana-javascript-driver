(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Registration = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.Registration.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class Registration
         *
         * @param {Gitana.Application} application
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.Registration"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Registration(this.getApplication(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_REGISTRATION;
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
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/send/confirmation";
            };

            return this.chainPostEmpty(this, uriFunction, {}, this);
        },

        sendWelcomeEmail: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/send/welcome";
            };

            return this.chainPostEmpty(this, uriFunction, {}, this);
        },

        confirm: function(newUserPassword, paymentMethodObject)
        {
            if (!paymentMethodObject)
            {
                paymentMethodObject = {};
            }

            const params = {
                "password": newUserPassword
            };

            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/confirm";
            };

            return this.chainPostEmpty(this, uriFunction, params, paymentMethodObject);
        }
    });

})(window);
