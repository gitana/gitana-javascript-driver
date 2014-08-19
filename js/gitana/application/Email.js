(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Email = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.Email.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class Email
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.Email"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Email(this.getApplication(), this);
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
