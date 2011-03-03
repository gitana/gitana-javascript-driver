var testRepositories = function()
{
    var gitana = new Gitana();

    var repositoryId = null;

    var createHandler = function(status)
    {
        if (!status.isOk())
	    {
	        alert("Create failed");
	    }

	    repositoryId = status.getId();
	    
	    // read the repository
	    gitana.repositories().read(repositoryId, readHandler);
    };
    
    var readHandler = function(repository)
    {
        // update the repository
        gitana.repositories().update(repository.getId(), repository, updateHandler);
    };
    
    var updateHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Update failed");
        }
    
        // delete the repo
        gitana.repositories().del(repositoryId, deleteHandler);
    };

    var deleteHandler = function(status)
    {
        if (!status.isOk())
        {
            alert("Delete failed");
        }
        
        // call list repositories for fun
        gitana.repositories().list(listHandler);
    };
    
    var listHandler = function(response)
    {
        // NOTHING TO DO
        //alert(Gitana.stringify(repositories));
    	alert("Success");
    };        

    // kick off the test after logging in
    gitana.security().authenticate("admin", "admin", function() {
        gitana.repositories().create(createHandler);
    });

};    
