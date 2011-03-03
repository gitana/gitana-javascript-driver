/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;

    Gitana.Service.Branches = function(repository)
    {
        this.repository = repository;
        this.repositoryId = repository.getId();
        this.driver = repository.driver;
    };

    /**
     * List
     *
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.list = function()
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
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/branches", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Branch(_this.repository, row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Read
     *
     * @param branchId
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.read = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var branchId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/branches/" + branchId, function(response) {

            callback(new Gitana.Object.Branch(this.repository, response));
            
        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Create
     *
     * @param changesetId
     * @param branchObject (optional)
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.create = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var changesetId = args.shift();

    	// OPTIONAL
    	var branchObject = null;
    	var callback = null;
    	if (args.length == 1)
    	{
    		if (Gitana.isFunction(args[0]))
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
    	this.driver.gitanaPost("/repositories/" + this.repositoryId + "/branches?changeset=" + changesetId, branchObject, callback, Gitana.ajaxErrorHandler);
    };

    /**
     * Update
     *
     * @param branchId
     * @param branchObject
     * @param callback (optional)
     */
    Gitana.Service.Branches.prototype.update = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var branchId = args.shift();
    	var branchObject = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaPut("/repositories/" + this.repositoryId + "/branches/" + branchId, branchObject, callback, Gitana.ajaxErrorHandler);
    };

    	
})(window);
