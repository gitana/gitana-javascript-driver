/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;

    Gitana.Service.Nodes = function(branch)
    {
        this.branch = branch;
        this.branchId = branch.getId();
        this.repository = branch.repository;
        this.repositoryId = branch.repository.getId();
        this.driver = branch.driver;
    };

    /**
     * List
     *
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.list = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Node(_this.branch, row);
            }
            response.list = list;

            // fire the callback
            callback(response);            

        }, Gitana.ajaxErrorHandler)
    };

    /**
     * Read
     *
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.read = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var nodeId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/"+ nodeId, function(response) {

            callback(new Gitana.Object.Node(_this.branch, response));

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Create
     *
     * @param nodeObject (optional)
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.create = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// OPTIONAL
    	var nodeObject = null;
    	var callback = null;
    	if (args.length == 1)
    	{
    		if (!Gitana.isFunction(args[0]))
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
    	this.driver.gitanaPost("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes", nodeObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Updates a node
     *
     * @param nodeId
     * @param nodeObject
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.update = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var nodeId = args.shift();
    	var nodeObject = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaPut("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + nodeId, nodeObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Delete
     *
     * @param nodeId
     * @param callback (optional)
     */
    Gitana.Service.Nodes.prototype.del = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var nodeId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaDelete("/repositories/" + this.repositoryId + "/branches/" + this.branchId + "/nodes/" + nodeId, callback, Gitana.ajaxErrorHandler);
    };
    
})(window);
