(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Security Service
     */
    Gitana.Security = Gitana.AbstractService.extend(
    {
        constructor: function(driver)
        {
            this.base(driver);
        },

        /**
         * Authenticates the driver as the given user.
         *
         * If authenticated, a ticket is returned and stored in the driver.
         *
         * @param username
         * @param password
         * @param callback (optional)
         */
        authenticate: function()
        {
            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var username = args.shift();
            var password = args.shift();

            // OPTIONAL
            var callback = args.shift();

            var _this = this;
            var f = function(response) {
                if (response.ticket) {
                    _this.getDriver().ticket = response.ticket;
                }

                if (callback)
                {
                    callback();
                }
            };

            // invoke
            this.getDriver().gitanaGet("/security/login?u=" + username + "&p=" + password, f, this.ajaxErrorHandler);
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
