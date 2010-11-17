/**
 * Methods for working with repository nodes
 */
(function(window) 
{
	var Gitana = window.Gitana;

    /**
     * List the root nodes of a repository
     * 
     * @param repositoryId
     * @param branchId
     * @param callback (optional)
     */
    Gitana.prototype.listRootNodes = function()
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
    	this.ajaxGet("/" + repositoryId + "/" + branchId + "/_list", callback, Gitana.ajaxErrorHandler)
    };
	
    /**
     * Read a node
     * 
     * @param repositoryId
     * @param branchId
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.prototype.readNode = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var branchId = args.shift();
    	var nodeId = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxGet("/" + repositoryId + "/" + branchId + "/"+ nodeId, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Creates a node
     * 
     * @param repositoryId
     * @param branchId
     * @param nodeObject (optional)
     * @param callback (optional)
     */
    Gitana.prototype.createNode = function()
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
    	var nodeObject = null;
    	var callback = null;
    	if (args.length == 1)
    	{
    		if (!this.isFunction(args[0]))
    		{
    			nodeObject = args.shift();
    		}
    		else
    		{
    			callback = args.shift();
    		}
    	}
    	else if (args.length == 2)
    	{
    		nodeObject = args.shift();
    		callback = args.shift();
    	}
    	
    	// invoke
    	this.ajaxPost("/" + repositoryId + "/" + branchId, nodeObject, callback, Gitana.ajaxErrorHandler);
    };    
    
    /**
     * Updates a node
     * 
     * @param repositoryId
     * @param branchId
     * @param nodeId
     * @param nodeObject
     * @param callback (optional)
     */
    Gitana.prototype.updateNode = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var branchId = args.shift();
    	var nodeId = args.shift();
    	var nodeObject = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxPut("/" + repositoryId + "/" + branchId + "/" + nodeId, nodeObject, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Deletes a node
     * 
     * @param repositoryId
     * @param branchId
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.prototype.deleteNode = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var branchId = args.shift();
    	var nodeId = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.ajaxDelete("/" + repositoryId + "/" + branchId + "/" + nodeId, callback, Gitana.ajaxErrorHandler);
    };    
    	
})(window);
