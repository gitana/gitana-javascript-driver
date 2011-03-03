/**
 * Repository functions
 */
(function(window) 
{
	var Gitana = window.Gitana;

    Gitana.Service.Changesets = function(repository)
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
    Gitana.Service.Changesets.prototype.list = function()
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
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/changesets", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Changeset(_this.repository, row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler)
    };

    /**
     * Read
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.read = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var changesetId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/changesets/" + changesetId, function(response) {

            callback(new Gitana.Object.Changeset(this.driver, response));

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Parents
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.parents = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var changesetId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/changesets/" + changesetId + "/parents", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Changeset(_this.repository, row);
            }
            response.list = list;

            // fire the callback
            callback(response);

        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Children
     *
     * @param changesetId
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.children = function()
    {
        var _this = this;

    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var changesetId = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaGet("/repositories/" + this.repositoryId + "/changesets/" + changesetId + "/children", function(response) {

            var list = [];
            for each (row in response.rows)
            {
                list[list.length] = new Gitana.Object.Changeset(_this.repository, row);
            }
            response.list = list;

            // fire the callback
            callback(response);            
            
        }, Gitana.ajaxErrorHandler);
    };

    /**
     * Update
     *
     * @param changesetId
     * @param changesetObject
     * @param callback (optional)
     */
    Gitana.Service.Changesets.prototype.update = function()
    {
    	var args = Gitana.makeArray(arguments);
    	if (args.length == 0)
    	{
    		// TODO: error
    	}

    	// REQUIRED
    	var changesetId = args.shift();
    	var changesetObject = args.shift();

    	// OPTIONAL
    	var callback = args.shift();

    	// invoke
    	this.driver.gitanaPut("/repositories/" + this.repositoryId + "/changesets/" + changesetId, changesetObject, callback, Gitana.ajaxErrorHandler);
    };
    
})(window);
