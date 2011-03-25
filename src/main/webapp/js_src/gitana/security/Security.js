(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Security = Gitana.AbstractService.extend(
    /** @lends Gitana.Security.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractService
         *
         * @class Security Service
         *
         * @param {Gitana.Driver} driver The Gitana driver for this service
         */
        constructor: function(driver)
        {
            this.base(driver);
        },

        /**
         * Authenticates the driver as the given user.
         * If authenticated, a ticket is returned and stored in the driver.
         *
         * @param {String} username the user name
         * @param {String} password password
         * @param [Function] successCallback Function to call if the operation succeeds.
         * @param [Function] failureCallback Function to call if the operation fails.
         */
        authenticate: function(username, password, successCallback, failureCallback)
        {
            var _this = this;

            var onSuccess = function(response)
            {
                if (response.ticket) {
                    _this.getDriver().ticket = response.ticket;
                }

                if (successCallback)
                {
                    successCallback(response);
                }
            };

            var onFailure = this.wrapFailureCallback(failureCallback);

            // invoke
            this.getDriver().gitanaGet("/security/login?u=" + username + "&p=" + password, onSuccess, onFailure);
        },

        /**
         * Clears any authentication for the driver.
         */
        clearAuthentication: function()
        {
            this.getDriver().ticket = null;
        }
        
    });

})(window);
