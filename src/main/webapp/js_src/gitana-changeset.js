/**
 * Methods for working with repository changesets
 */
(function(window) 
{
	var Gitana = window.Gitana;

    /**
     * List changesets of a repository
     * 
     * @param repositoryId
     * @param callback (optional)
     */
    Gitana.prototype.listChangesets = function()
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
    	this.ajaxGet("/" + repositoryId + "/_changesets", callback, Gitana.ajaxErrorHandler)
    };
	
    /**
     * Read a changeset
     * 
     * @param repositoryId
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.prototype.readChangeset = function()
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
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxGet("/" + repositoryId + "/_changesets/" + changesetId, callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * List the parents of a changeset
     * 
     * @param repositoryId
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.prototype.listChangesetParents = function()
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
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxGet("/" + repositoryId + "/_changesets/" + changesetId + "/_parents", callback, Gitana.ajaxErrorHandler);
    };

    /**
     * List the children of a changeset
     * 
     * @param repositoryId
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.prototype.listChangesetChildren = function()
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
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxGet("/" + repositoryId + "/_changesets/" + changesetId + "/_children", callback, Gitana.ajaxErrorHandler);
    };
    
    /**
     * Updates a changeset
     * 
     * @param repositoryId
     * @param changesetId
     * @param changesetObject
     * @param callback (optional)
     */
    Gitana.prototype.updateChangeset = function()
    {
    	var args = this.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}
    	
    	// REQUIRED
    	var repositoryId = args.shift();
    	var changesetId = args.shift();
    	var changesetObject = args.shift();
    	
    	// OPTIONAL
    	var callback = args.shift();
    	
    	// invoke
    	this.ajaxPut("/" + repositoryId + "/_changesets/" + changesetId, changesetObject, callback, Gitana.ajaxErrorHandler);
    };    
    	
})(window);
