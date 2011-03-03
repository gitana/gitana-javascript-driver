/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;

    Gitana.Service.Repositories = function(driver)
    {
        this.driver = driver;
    };

    /**
     * List
     *
     * @param callback (optional)
     */
    Gitana.Service.Repositories.prototype.list = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);

    	// OPTIONAL: callback
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Repository(_this.driver, row);
            }
            response.list = list;

            // fire the callback
            callback(response);            

        }, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Read
     *
     * @param repositoryId
     * @param callback
     */
    Gitana.Service.Repositories.prototype.read = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED: repositoryId
    	var repositoryId = args.shift();
    	
    	// OPTIONAL: callback
    	var callback = args.shift();
		
    	// invoke
    	this.driver.gitanaGet("/repositories/" + repositoryId, function(response) {

            callback(new Gitana.Object.Repository(_this.driver, response));

        }, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Create
     *
     * @param repositoryObject (optional) - either a json object representing the repo or a Repository object
     * @param callback (optional)
     */
    Gitana.Service.Repositories.prototype.create = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	var repositoryObject = null;
    	var callback = null;    	
    	if (args.length == 1)
    	{
    		// ONE ARGUMENT - either "repositoryObject" or "callback"
    		if (Gitana.isFunction(args[0]))
    		{
    			callback = args.shift();
    		}
    		else
    		{
    			repositoryObject = args.shift();
    		}
    	}
    	else if (args.length == 2)
    	{
    		// TWO ARGUMENTS
    		repositoryObject = args.shift();
    		callable = args.shift();
    	}

    	// invoke
    	this.driver.gitanaPost("/repositories", repositoryObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Update
     *
     * @param repositoryId
     * @param repositoryObject - either a json object representing the repository or a Repository object
     * @param callback (optional)
     */
    Gitana.Service.Repositories.prototype.update = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length <= 2)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var repositoryId = args.shift();
    	var repositoryObject = args.shift();
    	
    	// OPTIONAL - callback
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaPut("/repositories/" + repositoryId, repositoryObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Delete
     *
     * @param repositoryId
     * @param callback (optional)
     */
    Gitana.Service.Repositories.prototype.del = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaDelete("/repositories/" + repositoryId, callback, Gitana.ajaxErrorHandler);
    };
    	
})(window);
