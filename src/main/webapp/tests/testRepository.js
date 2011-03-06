var testRepositories = function()
{
    var driver = new Gitana.Driver();

    var repositoryId = null;

    var createHandler = function(status)
    {
        if (!status.isOk())
	    {
	        alert("Create failed");
	    }

	    repositoryId = status.getId();
	    
	    // read the repository
	    driver.repositories().read(repositoryId, readHandler);
    };
    
    var readHandler = function(repository)
    {
        // update the repository
        repository.update(updateHandler);
    };
    
    var updateHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Update failed");
        }
    
        // delete the repo
        driver.repositories().del(repositoryId, deleteHandler);
    };

    var deleteHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Delete failed");
        }
        
        // call list repositories for fun
        driver.repositories().list(listHandler);
    };
    
    var listHandler = function(response)
    {
    	alert("Success");
    };        

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(createHandler);
    });

};    
