/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;

    Gitana.Service.Security = function(driver)
    {
        this.driver = driver;
    };

    /**
     * Authenticates the driver as the given user.
     *
     * If authenticated, a ticket is returned and stored in the driver.
     *
     * @param username
     * @param password
     * @param callback (optional)
     */
    Gitana.Service.Security.prototype.authenticate = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
        var username = args.shift();
        var password = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

        var _this = this;
        var f = function(response)
        {
            if (response.ticket)
            {
                _this.driver.ticket = response.ticket;
            }

            if (callback)
            {
                callback();
            }
        };

    	// invoke
    	this.driver.gitanaGet("/security/login?u=" + username + "&p=" + password, f, Gitana.ajaxErrorHandler)
    };


    /**
     * Clears any authentication for this driver.
     */
    Gitana.Service.Security.prototype.clearAuthentication = function()
    {
        this.driver.ticket = null;
    };

})(window);
