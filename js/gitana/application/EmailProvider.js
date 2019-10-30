(function(window)
{
    Gitana = window.Gitana;

    Gitana.EmailProvider = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.EmailProvider.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class EmailProvider
         *
         * @param {Gitana.Application} application
         * @param [object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.EmailProvider"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.EmailProvider(this.getApplication(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_EMAIL_PROVIDER;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/emailproviders/" + this.getId();
        },

        /**
         * Sends the given email using this email provider.
         *
         * @param {Object} email
         * @param {Object} model
         *
         * @return {*}
         */
        send: function(email, model)
        {
            const self = this;

            if (!model)
            {
                model = {};
            }

            let emailId = null;
            if (Gitana.isString(email))
            {
                emailId = email;
            }
            else
            {
                emailId = email.getId();
            }

            const uriFunction = function()
            {
                return self.getUri() + "/send?email=" + emailId;
            };

            return this.chainPostEmpty(null, uriFunction, {}, model);
        },

        /**
         * Tests whether the email provider works.
         *
         * @param from
         * @param to
         * @returns {*}
         */
        test: function(from, to)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/test?from=" + from + "&to=" + to;
            };

            return this.chainPostEmpty(null, uriFunction);
        },

        /**
         * Sends an email containing the results of an export.
         *
         * @param exportId
         * @param emailConfig
         * @param callback
         * @returns {*}
         */
        sendForExport: function(exportId, emailConfig, callback)
        {

            const uriFunction = function()
            {
                return "/ref/exports/" + exportId + "/email";
            };

            const params = {};

            const payload = {
                "applicationId": this.getApplicationId(),
                "emailProviderId": this.getId(),
                "email": emailConfig
            };

            return this.chainPostResponse(this, uriFunction, params, payload).then(function(response) {
                callback(response);
            });
        }


    });

})(window);
