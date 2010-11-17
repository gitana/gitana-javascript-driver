/**
 * Methods for working with repository branches
 */
(function(window) 
{
	var Gitana = window.Gitana;
	
    /**
     * List branches of a repository
     * 
     * @param repositoryId
     * @param callback (optional)
     */
    Gitana.prototype.listBranches = function()
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
    	this.ajaxGet("/" + repositoryId + "/_branches", callback, Gitana.ajaxErrorHandler)
    };
	
    /**
     * Read a branch
     * 
     * @param repositoryId
     * @param branchId
     * @param callback (optional)
     */
    Gitana.prototype.readBranch = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var repositoryId = args.shift();
    	var branchId = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.ajaxGet("/" + repositoryId + "/_branches/" + branchId, callback, Gitana.ajaxErrorHandler);
    };
        
    /**
     * Creates a branch starting at the specified changeset
     * 
     * @param repositoryId
     * @param changesetId
     * @param branchObject (optional)
     * @param callback (optional)
     */
    Gitana.prototype.createBranch = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var changesetId = args.shift();
    	
    	// OPTIONAL    	
    	var branchObject = null;
    	var callback = null;    	
    	if (args.length == 1)
    	{
    		if (this.isFunction(args[0]))
    		{
    			callback = args.shift();
    		}
    		else
    		{
    			branchObject = args.shift();
    		}
    	}
    	else if (args.length == 2)
    	{
    		branchObject = args.shift();
    		callback = args.shift();
    	}
    	
    	// invoke    		
    	this.ajaxPost("/" + repositoryId + "/_branches?changeset=" + changesetId, branchObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Updates a branch
     * 
     * @param repositoryId
     * @param branchId
     * @param branchObject
     * @param callback (optional)
     */
    Gitana.prototype.updateBranch = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var branchId = args.shift();
    	var branchObject = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxPut("/" + repositoryId + "/_branches/" + branchId, branchObject, callback, Gitana.ajaxErrorHandler);
    };    
    	
})(window);
