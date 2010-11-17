/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;
	
    /**
     * Lists repositories
     * 
     * @param callback (optional)
     */
    Gitana.prototype.listRepositories = function()
    {
    	var args = this.makeArray(arguments);

    	// OPTIONAL: callback
    	var callback = args.shift();

    	// invoke
    	this.ajaxGet("/", callback, Gitana.ajaxErrorHandler)
    };
    
    /**
     * Reads a repository
     * 
     * @param repositoryId
     * @param callback
     */
    Gitana.prototype.readRepository = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED: repositoryId
    	var repositoryId = args.shift();
    	
    	// OPTIONAL: callback
    	var callback = args.shift();
		
    	// invoke
    	this.ajaxGet("/" + repositoryId, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Creates a repository
     * 
     * @param repositoryObject (optional)
     * @param callback (optional)
     */
    Gitana.prototype.createRepository = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	var repositoryObject = null;
    	var callback = null;    	
    	if (args.length == 1)
    	{
    		// ONE ARGUMENT - either "repositoryObject" or "callback"
    		if (this.isFunction(args[0]))
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
    	this.ajaxPost("/", repositoryObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Updates a repository
     * 
     * @param repositoryId
     * @param repositoryObject
     * @param callback (optional)
     */
    Gitana.prototype.updateRepository = function()
    {
    	var args = this.makeArray(arguments);
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
    	this.ajaxPut("/" + repositoryId, repositoryObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Deletes a repository
     * 
     * @param repositoryId
     * @param callback (optional)
     */
    Gitana.prototype.deleteRepository = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.ajaxDelete("/" + repositoryId, callback, Gitana.ajaxErrorHandler);
    };
    	
})(window);
