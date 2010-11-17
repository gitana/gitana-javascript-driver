var testRepositories = function(gitana)
{
    var createHandler = function(status)
    {
        var ok = status["ok"];
	    if (!ok)
	    {
	        alert("Create failed");
	    }
	    
	    var repositoryId = status["_doc"];
	    
	    // read the repository
	    gitana.readRepository(repositoryId, readHandler);
    };
    
    var readHandler = function(repository)
    {
        var repositoryId = repository["_doc"];
        
        // update the repository
        gitana.updateRepository(repositoryId, repository, updateHandler);
    };
    
    var updateHandler = function(status)
    {
        var ok = status["ok"];
        if (!ok)
        {
            alert("Update failed");
        }
    
        var repositoryId = status["_doc"];
        
        // delete the repo
        gitana.deleteRepository(repositoryId, deleteHandler);
    };

    var deleteHandler = function(status)
    {
        var ok = status["ok"];
        if (!ok)
        {
            alert("Delete failed");
        }
        
        // call list repositories for fun
        gitana.listRepositories(listHandler);
    };
    
    var listHandler = function(repositories)
    {
        // NOTHING TO DO
        //alert(Gitana.stringify(repositories));
    	alert("Success");
    };        

    // kick off the test
    gitana.createRepository(createHandler);
};    
